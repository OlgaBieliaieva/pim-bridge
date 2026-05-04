require("dotenv").config();
const axios = require("axios");
const https = require("https");

const API_URL = process.env.WOO_API_URL + "/products";
const WP_APP_PASS = process.env.WP_APPLICATION_PASSWORD;
const WP_APP_USER = process.env.WP_APPLICATION_USER;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});


async function fetchProducts() {
  try {
    const response = await axios.get(API_URL, {
        httpsAgent,
        params: {
        consumer_key: process.env.WOO_CONSUMER_KEY,
        consumer_secret: process.env.WOO_CONSUMER_SECRET,
      },
    
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    return [];
  }
}

async function main() {
  console.log("🚀 Fetching products...");

  const products = await fetchProducts();

  console.log(`✅ Loaded ${products.length} products`);

  products.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} | SKU: ${p.sku}`);
  });
}

main();