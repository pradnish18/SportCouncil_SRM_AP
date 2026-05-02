const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const clubsRouter = require('./routes/clubs');
const councilRouter = require('./routes/council');
const eventsRouter = require('./routes/events');
const newsRouter = require('./routes/news');
const statsRouter = require('./routes/stats');
const achievementsRouter = require('./routes/achievements');
const adminLoginRouter = require('./routes/admin/login');
const adminAchievementsRouter = require('./routes/admin/achievements');
const adminClubsRouter = require('./routes/admin/clubs');
const adminCouncilRouter = require('./routes/admin/council');
const adminEventsRouter = require('./routes/admin/events');
const adminNewsRouter = require('./routes/admin/news');
const adminStatsRouter = require('./routes/admin/stats');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/clubs', clubsRouter);
app.use('/api/council', councilRouter);
app.use('/api/events', eventsRouter);
app.use('/api/news', newsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/achievements', achievementsRouter);

app.use('/api/admin/login', adminLoginRouter);
app.use('/api/admin/achievements', adminAchievementsRouter);
app.use('/api/admin/clubs', adminClubsRouter);
app.use('/api/admin/council', adminCouncilRouter);
app.use('/api/admin/events', adminEventsRouter);
app.use('/api/admin/news', adminNewsRouter);
app.use('/api/admin/stats', adminStatsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
