import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export default async function handler(req, res) {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing url query" });

    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) return res.status(502).json({ error: "Failed to fetch target" });

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const getMeta = (sel) => doc.querySelector(sel)?.getAttribute("content") || null;

    const title = getMeta('meta[property="og:title"]')
               || getMeta('meta[name="twitter:title"]')
               || doc.querySelector("title")?.textContent?.trim()
               || null;

    let image = getMeta('meta[property="og:image"]')
             || getMeta('meta[name="twitter:image"]')
             || null;

    if (image && image.startsWith("//")) image = "https:" + image;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ title, image, source: url });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
