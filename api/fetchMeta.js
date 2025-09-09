const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  try {
    const url =
      "https://shopee.co.id/JeStudios-M4X-4x-Formula-1-Champion-F1-Tshirt-Max-Verstappen-i.320523026.28822239039";

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch product page" });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "No title";

    const image =
      $('meta[property="og:image"]').attr("content") ||
      "https://via.placeholder.com/300x300.png?text=No+Image";

    res.status(200).json({ title, image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
