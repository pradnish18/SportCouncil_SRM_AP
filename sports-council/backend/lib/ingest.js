const { query } = require('./pg');
const { generateEmbedding } = require('./rag');

const CHUNK_SIZE = 5;

async function insertChunks(chunks) {
  for (let i = 0; i < chunks.length; i += CHUNK_SIZE) {
    const batch = chunks.slice(i, i + CHUNK_SIZE);
    const embeddings = await Promise.all(batch.map(c => generateEmbedding(c.content)));

    for (let j = 0; j < batch.length; j++) {
      await query(
        `INSERT INTO knowledge_chunks (content, metadata, embedding) VALUES ($1, $2, $3::vector)`,
        [batch[j].content, JSON.stringify(batch[j].metadata), `[${embeddings[j].join(',')}]`]
      );
    }
    console.log(`  Inserted ${Math.min(i + CHUNK_SIZE, chunks.length)}/${chunks.length} chunks`);
  }
}

async function ingest() {
  console.log('Starting data ingestion...');
  const chunks = [];

  // Clubs
  const clubs = await query('SELECT * FROM clubs');
  for (const club of clubs.rows) {
    const parts = [
      `Club Name: ${club.name}`,
      club.description && `Description: ${club.description}`,
      club.convenorName && `Convenor: ${club.convenorName} (${club.convenorRole})`,
      club.coConvenorName && `Co-Convenor: ${club.coConvenorName} (${club.coConvenorRole})`,
      club.coachName && `Coach: ${club.coachName} (${club.coachRole})`,
      club.achievementsList && `Achievements: ${club.achievementsList}`,
    ].filter(Boolean);
    chunks.push({ content: parts.join('\n'), metadata: { source: 'clubs', id: club.id, name: club.name } });
  }
  console.log(`  ${clubs.rows.length} clubs`);

  // Events
  const events = await query('SELECT * FROM events');
  for (const event of events.rows) {
    const parts = [
      `Title: ${event.title}`,
      event.sport && `Sport: ${event.sport}`,
      event.venue && `Venue: ${event.venue}`,
      event.date && `Date: ${new Date(event.date).toLocaleDateString()}`,
      event.time && `Time: ${event.time}`,
      event.description && `Description: ${event.description}`,
      event.stage && `Stage: ${event.stage}`,
      event.team1 && `Team 1: ${event.team1}`,
      event.team2 && `Team 2: ${event.team2}`,
    ].filter(Boolean);
    chunks.push({ content: parts.join('\n'), metadata: { source: 'events', id: event.id, title: event.title } });
  }
  console.log(`  ${events.rows.length} events`);

  // Achievements
  const achievements = await query('SELECT * FROM achievements');
  for (const ach of achievements.rows) {
    const parts = [
      `Title: ${ach.title}`,
      ach.description && `Description: ${ach.description}`,
      ach.sport && `Sport: ${ach.sport}`,
      ach.category && `Category: ${ach.category}`,
      ach.date && `Date: ${new Date(ach.date).toLocaleDateString()}`,
    ].filter(Boolean);
    chunks.push({ content: parts.join('\n'), metadata: { source: 'achievements', id: ach.id, title: ach.title } });
  }
  console.log(`  ${achievements.rows.length} achievements`);

  // Council Members
  const members = await query('SELECT * FROM council_members');
  for (const m of members.rows) {
    chunks.push({
      content: `Name: ${m.name}\nTitle: ${m.title}\nTier: ${m.tier}`,
      metadata: { source: 'council_members', id: m.id, name: m.name, tier: m.tier },
    });
  }
  console.log(`  ${members.rows.length} council members`);

  // News
  const news = await query('SELECT * FROM news');
  for (const item of news.rows) {
    chunks.push({
      content: `Headline: ${item.headline}`,
      metadata: { source: 'news', id: item.id, headline: item.headline },
    });
  }
  console.log(`  ${news.rows.length} news items`);

  // Stats
  const stats = await query("SELECT * FROM stats WHERE id = 'global-stats'");
  if (stats.rows.length > 0) {
    chunks.push({
      content: `Total Teams: ${stats.rows[0].totalTeams}\nTotal Members: ${stats.rows[0].totalMembers}`,
      metadata: { source: 'stats' },
    });
  }

  console.log(`\nTotal chunks to embed: ${chunks.length}`);

  // Clear existing chunks and re-insert
  await query('TRUNCATE knowledge_chunks');
  await insertChunks(chunks);

  console.log('Ingestion complete!');
  process.exit(0);
}

ingest().catch(err => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
