const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async (req, res) => {
  try {
    const shopid = "320523026";
    const itemid = "28822239039";

    const apiUrl = `https://shopee.co.id/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-API-SOURCE": "pc"  // 👈 this header tricks Shopee
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch Shopee API" });
    }

    const data = await response.json();

    if (!data || !data.data || !data.data.item) {
      return res.status(404).json({ error: "Product not found" });
    }

    const item = data.data.item;

    const title = item.name;
    const image = `https://cf.shopee.co.id/file/${item.image}`;

    res.status(200).json({ title, image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
