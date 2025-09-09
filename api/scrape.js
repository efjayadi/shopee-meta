// api/scrape.js
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing url param" });

    // Fetch the Shopee product page HTML
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // fake browser agent
      },
    });

    const html = await response.text();

    // Load with cheerio
    const $ = cheerio.load(html);

    // Extract OG tags (this is what WhatsApp reads)
    const title = $('meta[property="og:title"]').attr("content") || "No title";
    const image = $('meta[property="og:image"]').attr("content") || "https://via.placeholder.com/300x300.png?text=No+Image";

    res.status(200).json({ title, image });
  } catch (err) {
    console.error("Scrape error:", err);
    res.status(500).json({ error: "Failed to scrape Shopee" });
  }
}
