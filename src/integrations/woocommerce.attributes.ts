require("dotenv").config()
import axios from "axios"
import https from "https"

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

const BASE =
  "https://woocommercetest.local/index.php/wp-json/wc/v3/products/attributes"

const auth = {
  consumer_key: process.env.WOO_CONSUMER_KEY!,
  consumer_secret: process.env.WOO_CONSUMER_SECRET!
}

// кеші
const attributeCache = new Map<string, number>()
const termCache = new Map<string, number>()

// ======================
// 📦 LOAD ATTRIBUTES
// ======================
async function loadAttributes() {
  const res = await axios.get(BASE, {
    params: auth,
    httpsAgent
  })

  res.data.forEach((attr: any) => {
    attributeCache.set(attr.name.toLowerCase(), attr.id)
  })
}

// ======================
// 🏗️ CREATE ATTRIBUTE
// ======================
async function createAttribute(name: string): Promise<number> {
  const res = await axios.post(
    BASE,
    {
      name,
      type: "select",
      has_archives: true
    },
    { params: auth, httpsAgent }
  )

  return res.data.id
}

// ======================
// 🔍 ENSURE ATTRIBUTE
// ======================
export async function ensureAttribute(name: string): Promise<number> {
  const key = name.toLowerCase()

  if (attributeCache.has(key)) {
    return attributeCache.get(key)!
  }

  if (attributeCache.size === 0) {
    await loadAttributes()
    if (attributeCache.has(key)) {
      return attributeCache.get(key)!
    }
  }

  const id = await createAttribute(name)
  attributeCache.set(key, id)

  return id
}

// ======================
// 🏗️ CREATE TERM
// ======================
async function createTerm(attributeId: number, value: string): Promise<number> {
  let id: number

  try {
    const res = await axios.post(
      `${BASE}/${attributeId}/terms`,
      { name: value },
      { params: auth, httpsAgent }
    )

    id = res.data.id
  } catch (e: any) {
    if (e.response?.data?.code === "term_exists") {
      id = e.response.data.data.resource_id
    } else {
      throw e
    }
  }

  return id
}

// ======================
// 🔍 ENSURE TERM
// ======================
export async function ensureTerm(
  attributeId: number,
  value: string
): Promise<number> {
  const key = `${attributeId}:${value.toLowerCase()}`

  if (termCache.has(key)) {
    return termCache.get(key)!
  }

  const id = await createTerm(attributeId, value)

  termCache.set(key, id)

  return id
}

// ======================
// 🔧 BUILD ATTRIBUTES
// ======================
export async function buildAttributes(product: any) {
  const result: any[] = []

  // 🔹 БРЕНД
  if (product.attributes.brand) {
    const attrId = await ensureAttribute("Бренд")

    await ensureTerm(attrId, product.attributes.brand)

    result.push({
      id: attrId,
      visible: true,
      variation: false,
      options: [product.attributes.brand]
    })
  }

  // 🔹 ВАГА
  if (product.attributes.weight) {
    const attrId = await ensureAttribute("Вага")

    const value = `${product.attributes.weight} г`

    await ensureTerm(attrId, value)

    result.push({
      id: attrId,
      visible: true,
      variation: false,
      options: [value]
    })
  }

  // 🔹 КРАЇНА
  if (product.attributes.country) {
    const attrId = await ensureAttribute("Країна")

    await ensureTerm(attrId, product.attributes.country)

    result.push({
      id: attrId,
      visible: true,
      variation: false,
      options: [product.attributes.country]
    })
  }

  return result
}