import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
      },
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    let title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      null;

    let image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      null;

    // Try application/ld+json
    if (!title || !image) {
      $('script[type="application/ld+json"]').each((i, el) => {
        try {
          const jsonText = $(el).html();
          if (!jsonText) return;
          const json = JSON.parse(jsonText.trim());
          if (json && !title && json.name) {
            title = json.name;
          }
          if (json && !image && json.image) {
            image = Array.isArray(json.image) ? json.image[0] : json.image;
          }
        } catch (e) {
          // skip invalid JSON instead of crashing
        }
      });
    }

    res.status(200).json({
      title: title || "No title",
      image: i
