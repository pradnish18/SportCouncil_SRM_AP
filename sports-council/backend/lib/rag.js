const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const EMBED_MODEL = 'nomic-embed-text';
const GEN_MODEL = 'deepseek-r1:1.5b';

async function generateEmbedding(text) {
  const res = await fetch(`${OLLAMA_HOST}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBED_MODEL, prompt: text }),
  });
  if (!res.ok) throw new Error(`Embedding error: ${res.status}`);
  const data = await res.json();
  return data.embedding;
}

function formatHistory(history) {
  if (!history || history.length === 0) return '';
  return history
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');
}

async function generateAnswer(context, question, history) {
  const historyBlock = formatHistory(history);
  const historySection = historyBlock ? `\n\nPrevious conversation:\n${historyBlock}` : '';
  const prompt = `You are a helpful assistant for the SRM Sports Council website. Answer the question based ONLY on the provided context. If the context doesn't contain enough information, say so politely. Be conversational and refer back to previous messages when relevant.${historySection}

Context:
${context}

Question: ${question}

Answer:`;

  const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: GEN_MODEL, prompt, stream: false }),
  });
  if (!res.ok) throw new Error(`Generation error: ${res.status}`);
  const data = await res.json();
  return data.response;
}

module.exports = { generateEmbedding, generateAnswer };
