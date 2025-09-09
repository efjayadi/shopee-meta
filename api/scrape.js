const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }

  try {
    const SCRAPER_API_KEY = "4b95149c1a0a6087cf25d0cd9e02f8ef"; // your key
    const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(
      url
    )}&render=true`;

    const response = await fetch(apiUrl);
    const html = await response.text();

    // Extract OG meta tags
    const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

    const title = ogTitleMatch ? ogTitleMatch[1] : "No title";
    const image = ogImageMatch ? ogImageMatch[1] : "https://via.placeholder.com/300x300.png?text=No+Image";

    res.status(200).json({ title, image });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Shopee via ScraperAPI", details: err.message });
  }
};
