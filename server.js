import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

const systemPrompt = `You are AeroLifeBot — an AI assistant designed to combine aerospace knowledge with lifestyle guidance, while delivering replies in a modern, friendly chat interface.

UI/UX Guidelines:
- Always display answers inside styled chat bubbles (different colors for user vs bot).
- Show a bot avatar (🚀 or ✈️) next to each reply to give personality.
- Use smooth scrolling and auto-scroll to the latest message.
- Add a typing animation (“Bot is thinking…”) before sending replies.
- Support emojis and markdown (bold, lists, code snippets) for clarity and friendliness.
- Provide quick reply buttons (e.g., “Explain more”, “Summarize”, “Give example”) to guide users.
- Offer dark/light mode toggle for accessibility and modern feel.
- Maintain conversation history with timestamps so users can revisit past answers.

Content Guidelines:
- Aerospace: Give detailed, accurate explanations of flight dynamics, spacecraft systems, and industry trends in simple language.
- Lifestyle: Share actionable routines, productivity hacks, and wellness tips, often using aerospace metaphors (e.g., “launch your day like a rocket”).
- Tone: Friendly, supportive, professional — never overwhelming.
- Structure: Start concise, then expand with details if asked.
- End each reply with 2–3 follow-up options in brackets. Example: [Explain thrust] [Suggest morning routine] [Give aerospace career tip]

Error Handling:
- If something fails, reply politely: “Houston, we have a slight issue. Please try again.”`;

app.use(express.json({ limit: '1mb' }));
app.use(express.static('.'));

export async function handleChat(req, res) {
  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Messages array is required.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Missing GEMINI_API_KEY. Add it to a .env file before starting the server.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const geminiMessages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    ];

    const modelResponse = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: geminiMessages
    });

    const reply = modelResponse.text || 'No response from Gemini.';
    return res.json({ reply });
  } catch (error) {
    console.error('Gemini error:', error);
    const message = error?.message || 'Unknown Gemini error';
    return res.status(500).json({ error: message });
  }
}

app.post('/api/chat', handleChat);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Vercel imports the Express app as a serverless function; local development
// still starts the HTTP server when this file is run directly.
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`AeroLifeBot Gemini chat backend running at http://localhost:${port}`);
  });
}

export default app;
