export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'url query parameter is required' });
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: req.headers, // 필요 시 필터링
    });

    const text = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch target URL: ' + e.message });
  }
}
