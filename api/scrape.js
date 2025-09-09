const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }

  try {
    const SCRAPER_API_KEY = "4b95149c1a0a6087cf25d0cd9e02f8ef"; // your ScraperAPI key
    const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(
      url
    )}&render=true`;

    const response = await fetch(apiUrl);
    const html = await response.text();

    // Try OG meta tags first
    let titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    let imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);

    let title = titleMatch ? titleMatch[1] : null;
    let image = imageMatch ? imageMatch[1] : null;

    // Fallback: parse <script type="application/ld+json">
    if (!title || !image) {
      const scriptMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
      if (scriptMatches) {
        for (const scriptTag of scriptMatches) {
          try {
            const jsonText = scriptTag.replace(/<script type="application\/ld\+json">|<\/script>/g, '').trim();
            const json = JSON.parse(jsonText);

            if (!title && json.name) title = json.name;
            if (!image && json.image) image = Array.isArray(json.image) ? json.image[0] : json.image;

            if (title && image) break; // found both
          } catch (e) {
            // ignore invalid JSON
          }
        }
      }
    }

    res.status(200).json({
      title: title || "No title",
      image: image || "https://via.placeholder.com/300x300.png?text=No+Image"
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Shopee page", details: err.message });
  }
};
