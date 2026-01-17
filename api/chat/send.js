import { getAIResponse } from '../../../aiService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, userName } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const senderName = userName && typeof userName === 'string' ? userName : 'Friend';

    const reply = await getAIResponse(message, senderName, false);

    return res.status(200).json({
      aiMessage: { text: reply }
    });
  } catch (error) {
    console.error('Error in /api/chat/send:', error);
    return res.status(500).json({ error: 'Failed to generate reply' });
  }
}
