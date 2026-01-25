import { getAIResponse } from '../../../aiService.js';

// Helper to read and parse JSON body for Vercel Node functions
async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let data = '';
    const timeout = setTimeout(() => {
      reject(new Error('Request body parsing timeout'));
    }, 5000);
    
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      clearTimeout(timeout);
      try {
        if (!data) return resolve({});
        const parsed = JSON.parse(data);
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export default async function handler(req, res) {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Incoming request: ${req.method} /api/chat/send`);
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    console.log(`[${requestId}] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Verify environment variables
    if (!process.env.GROQ_API_KEY) {
      console.error(`[${requestId}] ❌ GROQ_API_KEY is not set in environment variables`);
      return res.status(500).json({ 
        error: 'API Key not configured',
        aiMessage: { text: "Server configuration issue. Please contact admin! 🙏" }
      });
    }

    console.log(`[${requestId}] Parsing request body...`);
    const body = await parseJsonBody(req);
    const { message, userName } = body || {};

    if (!message || typeof message !== 'string') {
      console.log(`[${requestId}] Invalid message: ${typeof message}`);
      return res.status(400).json({ error: 'Message is required' });
    }

    const senderName = userName && typeof userName === 'string' ? userName : 'Friend';
    console.log(`[${requestId}] Processing message from ${senderName}: "${message.substring(0, 50)}..."`);

    const startTime = Date.now();
    const reply = await getAIResponse(message, senderName, false);
    const duration = Date.now() - startTime;
    
    console.log(`[${requestId}] ✅ AI response generated in ${duration}ms`);

    return res.status(200).json({
      aiMessage: { text: reply }
    });
  } catch (error) {
    console.error(`[${requestId}] ❌ Error in /api/chat/send:`, error.message || error);
    console.error(`[${requestId}] Stack:`, error.stack);
    
    // Determine appropriate error response
    const errorMessage = error.message || 'Internal Server Error';
    const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('429');
    const fallbackText = isTimeout 
      ? "API thoda busy hai abhi. Ek minute baad try karna! 🔄"
      : "Sorry yaar, thoda issue aa gaya server pe. Thodi der baad try karna! 🙈";
    
    return res.status(500).json({
      error: errorMessage,
      requestId: requestId,
      aiMessage: { text: fallbackText }
    });
  }
}
