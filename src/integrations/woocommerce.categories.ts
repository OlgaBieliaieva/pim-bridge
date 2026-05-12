require("dotenv").config()
import axios from "axios"
import https from "https"

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

const CATEGORY_API =
  "https://woocommercetest.local/index.php/wp-json/wc/v3/products/categories"

const auth = {
  consumer_key: process.env.WOO_CONSUMER_KEY!,
  consumer_secret: process.env.WOO_CONSUMER_SECRET!
}

// кеш: "Кондитерка/Інгредієнти" → id
const cache = new Map<string, number>()

export async function ensureCategory(path: string[]): Promise<number> {
  let parent = 0
  let fullPath = ""

  for (const name of path) {
    fullPath += "/" + name

    if (cache.has(fullPath)) {
      parent = cache.get(fullPath)!
      continue
    }

    let id: number

    try {
      const res = await axios.post(
        CATEGORY_API,
        { name, parent },
        { httpsAgent, params: auth }
      )

      id = res.data.id
    } catch (e: any) {
      if (e.response?.data?.code === "term_exists") {
        id = e.response.data.data.resource_id
      } else {
        throw e
      }
    }

    cache.set(fullPath, id)
    parent = id
  }

  return parent
}