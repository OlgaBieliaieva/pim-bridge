require("dotenv").config()
import axios from "axios"
import https from "https"

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

const BRAND_API =
  "https://woocommercetest.local/index.php/wp-json/wc/v3/products/brands"

const auth = {
  consumer_key: process.env.WOO_CONSUMER_KEY!,
  consumer_secret: process.env.WOO_CONSUMER_SECRET!
}

const brandCache = new Map<string, number>()

export async function ensureBrand(name: string | null): Promise<number | null> {
  if (!name) return null

  const key = name.toLowerCase()

  if (brandCache.has(key)) {
    return brandCache.get(key)!
  }

  // 🔍 пошук
  const res = await axios.get(BRAND_API, {
    httpsAgent,
    params: { ...auth, search: name }
  })

  let brand = res.data.find(
    (b: any) => b.name.toLowerCase() === key
  )

  // ➕ створення
  if (!brand) {
    try {
      const created = await axios.post(
        BRAND_API,
        { name },
        { httpsAgent, params: auth }
      )

      brand = created.data
    } catch (e: any) {
      if (e.response?.data?.code === "term_exists") {
        const id = e.response.data.data.resource_id
        brand = { id, name }
      } else {
        throw e
      }
    }
  }

  brandCache.set(key, brand.id)

  return brand.id
}