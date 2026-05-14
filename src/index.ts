require("dotenv").config();
import express from "express"
import { parseXML } from "./parsers/torgsoft.parser"
// import { syncProduct } from "./integrations/woocommerce"
import { processProduct } from "./core/pipeline"
import { fetchWooProducts } from "./integrations/woocommerce/fetch-products"
import { processWooRun } from "./core/pipeline/process-woo-run"
import { testGemini } from "./integrations/ai/gemini.test"
import { refineProductWithAi} from "./core/ai/refine-product-with-ai"
// import {findProductBySKU} from "./integrations/woocommerce"

const app = express()
const FILE_PATH = "C:/Users/Admin/my/projects/pim-bridge/feed/TSGoods.yml";


// ======================
// 📥 FETCH RAW PRODUCTS
// ======================

app.get(
  "/prydane/products/fetch",

  async (req, res) => {

    try {

      const start =
        Number(req.query.start) || 1

      const end =
        Number(req.query.end) || start

      const result =
        await fetchWooProducts(
          start,
          end
        )

      res.json({
        success: true,

        ...result
      })

    } catch (error: any) {

      console.error(error)

      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
)

// ======================
// ⚙️ PROCESS RAW RUN
// ======================

app.get(
  "/prydane/products/process",

  async (req, res) => {

    try {

      const runId =
        String(req.query.runId)

      if (!runId) {
        return res
          .status(400)
          .json({
            error: "runId required"
          })
      }

      await processWooRun(runId)

      res.json({
        success: true,
        runId
      })

    } catch (error: any) {

      console.error(error)

      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
)

// ======================
// ⚙️ AI TEST
// ======================

app.get(
  "/ai/test",
  async (_, res) => {

    try {

      const result =
        await testGemini()

      res.json({
        success: true,
        result
      })

    } catch (e) {

      console.error(e)

      res.status(500).json({
        error: "AI test failed"
      })
    }
  }
)

app.get(
  "/ai/refine-test",
  async (_, res) => {

    try {

      const result =
        await refineProductWithAi({

          rawTitle:
            `"Сироп "" Гренадін "" 270мл MARIBELL ."`,
          
          normalizedTitle:
            "Сироп Гренадін",

          normalizedDescription:
            "Гренадін 270мл",

          categoryPath: [
            "Сироп"
          ],

          attributes: {

            brand:
              "MARIBELL",

            volume:
              270
          }
        })

      res.json(result)

    } catch (e) {

      console.error(e)

      res.status(500).json({

        error:
          "AI refinement failed"
      })
    }
  }
)



app.get("/run", async (req, res) => {
  const products = await parseXML(FILE_PATH)

  for (const product of products.slice(5, 25)) {
    await processProduct(product)
  }

  res.send("Sync done")
})

// app.get("/prydane/products", async (req, res) => {
//   try {
//     const perPage = 100;

//     const start = Number(req.query.start) || 1;
//     const end = Number(req.query.end) || start;

//     const dir = "./data/prydane/products";
//     await fs.mkdir(dir, { recursive: true });

//     let totalSaved = 0;

//     for (let page = start; page <= end; page++) {
//       console.log(`Fetching page ${page}...`);

//       const response = await axios.get(API, {
//         params: {
//           consumer_key: process.env.PRYDANE_CONSUMER_KEY,
//           consumer_secret: process.env.PRYDANE_CONSUMER_SECRET,
//           per_page: perPage,
//           page,
//         },
//       });

//       const products = response.data;

//       if (!products.length) {
//         console.log(`Page ${page} is empty, stopping`);
//         break;
//       }

//       const filename = path.join(
//         dir,
//         `products_p_${page}.json`
//       );

//       await fs.writeFile(
//         filename,
//         JSON.stringify(products, null, 2),
//         "utf-8"
//       );

//       totalSaved += products.length;

//       console.log(`Saved page ${page}`);

//       // маленька пауза щоб не навантажувати сервер
//       await new Promise((r) => setTimeout(r, 300));
//     }

//     res.json({
//       message: "Done",
//       pages: `${start}-${end}`,
//       total: totalSaved,
//     });

//   } catch (error) {
//     const err = error as Error;
//     console.error(err.message);

//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

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