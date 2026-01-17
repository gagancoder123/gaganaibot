export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Vercel serverless functions are stateless; return empty history.
  // The frontend will still render correctly.
  return res.status(200).json({ messages: [] });
}
