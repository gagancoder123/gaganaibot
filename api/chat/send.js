import { getAIResponse } from '../../../aiService.js';

// Helper to read and parse JSON body for Vercel Node functions
async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        if (!data) return resolve({});
        const parsed = JSON.parse(data);
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = await parseJsonBody(req);
    const { message, userName } = body || {};

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
    // Gracefully return a fallback message to avoid UI errors
    return res.status(200).json({
      aiMessage: { text: "Sorry yaar, thoda issue aa gaya server pe. Thodi der baad try karna! 🙈" }
    });
  }
}
