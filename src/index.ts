import express from "express"
import { parseXML } from "./parsers/torgsoft.parser"
// import { syncProduct } from "./integrations/woocommerce"
import { processProduct } from "./core/pipeline"
// import {findProductBySKU} from "./integrations/woocommerce"

const app = express()
const FILE_PATH = "C:/Users/Admin/my/projects/pim-bridge/feed/TSGoods.yml";

app.get("/run", async (req, res) => {
  const products = await parseXML(FILE_PATH)

  for (const product of products.slice(5, 25)) {
    await processProduct(product)
  }

  res.send("Sync done")
})

// app.post("/torgsoft-sync", async (req, res) => {
//   const products = await parseXML("path")

//   if (products.length > 0) {
//     await syncProduct(products[0])
//   }

//   res.send("OK")
// })

app.listen(3000)

// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const https = require("https");
// const fs = require("fs");
// const xml2js = require("xml2js");

// const app = express();
// app.use(express.json());

// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
// });

// // 👉 URL WooCommerce
// const WOO_API_URL =
//   "https://woocommercetest.local/index.php/wp-json/wc/v3/products";

// // 👉 шлях до файлу з Торгсофт
// const FILE_PATH = "C:/Users/Admin/my/projects/pim-bridge/feed/TSGoods.yml";

// // =======================
// // 📦 ПАРСИНГ XML
// // =======================
// async function parseXML() {
//   const xml = fs.readFileSync(FILE_PATH, "utf-8");
//   const result = await xml2js.parseStringPromise(xml);

//   const offers =
//     result.yml_catalog.shop[0].offers[0].offer || [];

//   return offers.map((offer) => {
//     const params = {};

//     if (offer.param) {
//       offer.param.forEach((p) => {
//         params[p.$.name.toLowerCase()] = p._;
//       });
//     }

//     return {
//       external_id: offer.$.id,

//       sku: clean(params.goodid || offer.vendorCode?.[0]),

//       name: clean(params.goodname),

//       price: offer.oldprice?.[0] || "0",

//       description: clean(offer.description?.[0]),

//       size: clean(params.goodsize),

//       stock: 0, // поки немає в XML

//       // image: offer.picture?.[0],
//     };
//   });
// }

// // очистка лапок
// function clean(val) {
//   if (!val) return "";
//   return val.replace(/&quot;|"/g, "").trim();
// }

// // =======================
// // 🔍 ПОШУК ПО SKU
// // =======================
// async function findProductBySKU(sku) {
//   const res = await axios.get(WOO_API_URL, {
//     httpsAgent,
//     params: {
//       consumer_key: process.env.WOO_CONSUMER_KEY,
//       consumer_secret: process.env.WOO_CONSUMER_SECRET,
//       sku: sku,
//     },
//   });

//   return res.data.length > 0 ? res.data[0] : null;
// }

// // =======================
// // 🔄 CREATE або UPDATE
// // =======================
// async function syncProduct(product) {
//   try {
//     const existing = await findProductBySKU(product.sku);

//     const payload = {
//       name: product.name || `Товар ${product.external_id}`,
//       type: "simple",
//       regular_price: String(product.price || "0"),
//       description: product.description || "",
//       manage_stock: true,
//       stock_quantity: product.stock || 0,
//       sku: product.sku,

//       // 👉 атрибут (розмір)
//       attributes: product.size
//         ? [
//             {
//               name: "Розмір",
//               visible: true,
//               variation: false,
//               options: [product.size],
//             },
//           ]
//         : [],

//       // 👉 зображення (поки просто ім'я файлу)
//       // images: product.image
//       //   ? [
//       //       {
//       //         src: `https://your-domain.com/images/${product.image}`,
//       //       },
//       //     ]
//       //   : [],
//     };

//     if (existing) {
//       const res = await axios.put(
//         `${WOO_API_URL}/${existing.id}`,
//         payload,
//         {
//           httpsAgent,
//           params: {
//             consumer_key: process.env.WOO_CONSUMER_KEY,
//             consumer_secret: process.env.WOO_CONSUMER_SECRET,
//           },
//         }
//       );

//       console.log("🔄 Updated:", res.data.name);
//     } else {
//       const res = await axios.post(WOO_API_URL, payload, {
//         httpsAgent,
//         params: {
//           consumer_key: process.env.WOO_CONSUMER_KEY,
//           consumer_secret: process.env.WOO_CONSUMER_SECRET,
//         },
//       });

//       console.log("✅ Created:", res.data.name);
//     }
//   } catch (error) {
//     console.error("❌ Sync error:", error.response?.data || error.message);
//   }
// }

// // =======================
// // 📩 WEBHOOK
// // =======================
// app.post("/torgsoft-sync", async (req, res) => {
//   console.log("📩 Торгсофт повідомив про оновлення");

//   try {
//     const products = await parseXML();

//     console.log(`📦 Знайдено ${products.length} товарів`);

//     // 👉 для тесту — беремо тільки 1 товар
//     if (products.length > 0) {
//       await syncProduct(products[0]);
//     }

//     res.send("OK");
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//     res.status(500).send("Error");
//   }
// });

// // =======================
// // 🧪 ТЕСТ ЕНДПОІНТ
// // =======================
// app.get("/test-sync", async (req, res) => {
//   const products = await parseXML();
//   console.log(products.length);

//   if (products.length > 0) {
//     await syncProduct(products[7]);
//   }

//   res.send("Test sync done");
// });

// // =======================
// // 🚀 START
// // =======================
// app.listen(3000, () => {
//   console.log("🚀 Server running on http://localhost:3000");
// });

// // const express = require("express");

// // const app = express();
// // app.use(express.json());

// // app.post("/torgsoft-sync", (req, res) => {
// //   console.log("📩 Дані від Торгсофт отримані");
// //   console.log(req.body);

// //   res.send("OK");
// // });

// // app.get("/torgsoft-sync", (req, res) => {
// //   res.send("OK");
// // });

// // app.listen(3000, () => {
// //   console.log("🚀 Server running on port 3000");
// // });

// // require("dotenv").config();
// // const axios = require("axios");
// // const https = require("https");

// // const API_URL = process.env.WOO_API_URL + "/products";
// // const WP_APP_PASS = process.env.WP_APPLICATION_PASSWORD;
// // const WP_APP_USER = process.env.WP_APPLICATION_USER;

// // const httpsAgent = new https.Agent({
// //   rejectUnauthorized: false,
// // });


// // async function fetchProducts() {
// //   try {
// //     const response = await axios.get(API_URL, {
// //         httpsAgent,
// //         params: {
// //         consumer_key: process.env.WOO_CONSUMER_KEY,
// //         consumer_secret: process.env.WOO_CONSUMER_SECRET,
// //       },
    
// //     });

// //     return response.data;
// //   } catch (error) {
// //     console.error("❌ Error:", error.response?.data || error.message);
// //     return [];
// //   }
// // }

// // async function main() {
// //   console.log("🚀 Fetching products...");

// //   const products = await fetchProducts();

// //   console.log(`✅ Loaded ${products.length} products`);

// //   products.forEach((p, i) => {
// //     console.log(`${i + 1}. ${p.name} | SKU: ${p.sku}`);
// //   });
// // }

// // main();