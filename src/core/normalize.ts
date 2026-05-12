export function normalizeProduct(raw: any) {
  const baseName = raw.name.replace(/\.$/, "").trim()

  const country = extractCountry(baseName)
  const brand = extractBrand(baseName, country)

  const cleanedName = cleanName(baseName, country, brand)

  const weightMatch = cleanedName.match(/(\d+)\s?г/)
  const weight = weightMatch ? Number(weightMatch[1]) : null


  return {
    externalId: raw.external_id,
    sku: raw.sku,
    isAvailable: raw.available,
    name: cleanedName,    
    description: cleanDescription(raw.description, brand, country),
    price: Number(raw.price),
    stock: raw.stock,
    goodTypeFull: raw.goodTypeFull,

    attributes: {
      weight,
      brand,
      country
    }
  }
}

const COUNTRIES = [
  "україна",
  "туреччина",
  "італія",
  "польща",
  "китай"
] 



function extractCountry(name: string): string | null {
  const lower = name.toLowerCase()

  for (const country of COUNTRIES) {
    if (lower.includes(country)) {
      return capitalize(country)
    }
  }

  return null
}

function extractBrand(name: string, country: string | null): string | null {
  let cleaned = name.toLowerCase()

  // прибираємо країну
  if (country) {
    cleaned = cleaned.replace(country.toLowerCase(), "")
  }

  const words = cleaned.trim().split(" ")

  const last = words[words.length - 1]

  if (last && last.length > 2 && !/\d/.test(last)) {
    return capitalize(last)
  }

  return null
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function cleanName(name: string, country: string | null, brand: string | null) {
  let result = name

  if (country) {
    const regex = new RegExp(escapeRegExp(country), "i")
    result = result.replace(regex, "")
  }

  if (brand) {
    const regex = new RegExp(escapeRegExp(brand), "i")
    result = result.replace(regex, "")
  }

  return result
    .replace(/\s+/g, " ")
    .trim()
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function cleanDescription(desc: string, brand: string | null, country: string | null) {
  let result = desc

  if (brand) {
    result = result.replace(new RegExp(brand, "i"), "")
  }

  if (country) {
    result = result.replace(new RegExp(country, "i"), "")
  }

  return result.replace(/\s+/g, " ").trim()
}