export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // No persistent storage on serverless; just acknowledge.
  return res.status(200).json({ ok: true });
}
