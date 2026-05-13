export type ConfidenceReport = {

  score: number

  reasons: string[]
}

// ======================
// 📏 DIMENSIONS
// ======================

export type ProductDimensions = {

  width?: number

  height?: number

  length?: number

  unit?: string | null
}

// ======================
// 🧩 ATTRIBUTES
// ======================

export type ProductAttributes = {

  brand?: string | null

  country?: string | null

  model?: string | null

  weight?: number | null

  volume?: number | null

  dimensions?: ProductDimensions | null

  diameter?: number | null

  height?: number | null

  barcode?: string | null

  color?: string | null

  material?: string | null

  series?: string | null
}

// ======================
// 🧠 NORMALIZATION
// ======================

export type NormalizationMeta = {

  version: string

  strategy:
    | "deterministic"
    | "ai"
    | "hybrid"

  processor?: string

  warnings?: string[]
}

// ======================
// 🕓 TIMESTAMPS
// ======================

export type ProductTimestamps = {

  createdAt?: string

  updatedAt?: string

  normalizedAt?: string
}

// ======================
// ✅ PRODUCT
// ======================

export type NormalizedProduct = {

  // 🔌 Source
  source:
    | "woocommerce"
    | "torgsoft"

  // 🆔 External ID
  externalId: string

  // 📦 SKU
  sku: string

  // 🧾 RAW
  rawTitle: string

  rawDescription?: string

  // ✨ NORMALIZED
  normalizedTitle: string

  normalizedDescription?: string

  // 🌐 Slug
  slug?: string

  // 📂 Categories
  categoryPath: string[]

  // 🧩 Attributes
  attributes: ProductAttributes

  // 💰 Commerce
  price?: number

  stock?: number

  isAvailable?: boolean

  currency?: string

  // 🖼️ Media
  images?: string[]

  // 📊 Confidence
  confidence: ConfidenceReport

  // 🧠 Metadata
  normalization: NormalizationMeta

  // 🕓 Timestamps
  timestamps: ProductTimestamps

  diameter?: number | null

  height?: number | null
}