require("dotenv").config();

import axios from "axios"
import https from "https"
import { RawProduct } from "../types/product"

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

const WOO_API_URL =
  "https://woocommercetest.local/index.php/wp-json/wc/v3/products";

export async function findProductBySKU(sku: number) {
    const res = await axios.get(WOO_API_URL, {
    httpsAgent,
    params: {
      consumer_key: process.env.WOO_CONSUMER_KEY,
      consumer_secret: process.env.WOO_CONSUMER_SECRET,
      sku: sku,
    },
  });

  console.log(res.data.length > 0 ? res.data[0] : null)
  return ;
}

export async function syncProduct(product: RawProduct) {
  // логіка як у тебе, але типізована
}