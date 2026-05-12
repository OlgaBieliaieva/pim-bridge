require("dotenv").config();
import axios from "axios"
import https from "https"
import { ensureCategory } from "./woocommerce.categories"
import { ensureBrand } from "./woocommerce.brands"
import { buildAttributes } from "./woocommerce.attributes"

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

// const API = process.env.WOO_API_URL + "/products"
// // 👉 URL WooCommerce
const WOO_API_URL =
  "https://woocommercetest.local/index.php/wp-json/wc/v3/products";



// ======================
// 🔍 FIND BY SKU
// ======================
async function findBySKU(sku: string) {
  const res = await axios.get(WOO_API_URL, {
    httpsAgent,
    params: {
      consumer_key: process.env.WOO_CONSUMER_KEY,
      consumer_secret: process.env.WOO_CONSUMER_SECRET,
      sku: sku,
    },
  });

  return res.data.length ? res.data[0] : null
}

// ======================
// 🧱 BUILD PAYLOAD
// ======================
async function buildPayload(product: any, categoryPath: string[]) {
  const categoryId = await ensureCategory(categoryPath)
  const brandId = await ensureBrand(product.attributes.brand)
  const attributes = await buildAttributes(product)

  const inStock = product.isAvailable && product.stock > 0

  return {
    name: product.name, //+
    type: "simple", //+
    status: product.isAvailable ? "publish" : "draft", //+
    stock_status: inStock ? "instock" : "outofstock", //+
    regular_price: String(product.price), //+
    description: product.description, //+
    short_description: `${product.description.slice(0, 10)}...`, //+
    sku: product.sku, //+
    manage_stock: true, //+
    stock_quantity: product.stock || 0, //+
    categories: [{ id: categoryId }],
    brands: brandId ? [{ id: brandId }] : [],
    attributes
  }
}

// ======================
// 🔄 SYNC PRODUCT
// ======================
export async function syncProduct(product: any, categoryPath: string[]) {
  try {
    const existing = await findBySKU(product.sku)
    const payload = await buildPayload(product, categoryPath)

    if (existing) {
      await axios.put(
        `${WOO_API_URL}/${existing.id}`,
        payload,
        {
          httpsAgent,
          params: {
            consumer_key: process.env.WOO_CONSUMER_KEY,
            consumer_secret: process.env.WOO_CONSUMER_SECRET,
          },
        }
      );
      console.log("🔄 Updated:", product.name)
    } else {
      await axios.post(WOO_API_URL, payload, {
        httpsAgent,
        params: {
          consumer_key: process.env.WOO_CONSUMER_KEY,
          consumer_secret: process.env.WOO_CONSUMER_SECRET,
        },
      });
      console.log("✅ Created:", product.name)
    }
  } catch (e: any) {
    console.error("❌ Sync error:", e.response?.data || e.message)
  }
}