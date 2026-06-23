const express = require('express');
const router = express.Router();
const { query } = require('../../lib/pg');
const { generateEmbedding, generateAnswer } = require('../../lib/rag');

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Generate embedding for the question
    const embedding = await generateEmbedding(message);

    // 2. Search for similar chunks
    const result = await query(
      `SELECT content, metadata, 1 - (embedding <=> $1::vector) AS similarity
       FROM knowledge_chunks
       ORDER BY embedding <=> $1::vector
       LIMIT 5`,
      [`[${embedding.join(',')}]`]
    );

    // 3. Build context from retrieved chunks
    const context = result.rows
      .filter(r => r.similarity > 0.3)
      .map(r => r.content)
      .join('\n\n');

    if (!context) {
      return res.json({ reply: "I'm sorry, I couldn't find relevant information to answer your question. Try asking about clubs, events, achievements, or council members." });
    }

    // 4. Generate answer using LLM with conversation history
    const recentHistory = (history || []).slice(-6);
    const reply = await generateAnswer(context, message, recentHistory);

    return res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Failed to process your message' });
  }
});

module.exports = router;
