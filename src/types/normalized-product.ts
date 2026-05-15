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

export type ProvenanceAttribute<T> = {

  value: T

  source:
    | "dictionary"
    | "regex"
    | "ai"

  confidence: number

  requiresReview: boolean
}

export type ProductAttributes = {

  brand?:
    ProvenanceAttribute<string | null>

  country?:
    ProvenanceAttribute<string | null>

  material?:
    ProvenanceAttribute<string | null>

  color?:
    ProvenanceAttribute<string | null>

  model?:
    ProvenanceAttribute<string | null>

  weight?:
    ProvenanceAttribute<number | null>

  volume?:
    ProvenanceAttribute<number | null>

  diameter?:
    ProvenanceAttribute<number | null>

  height?:
    ProvenanceAttribute<number | null>

  dimensions?:
    ProvenanceAttribute<
      ProductDimensions | null
    >
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
  // price?: number

  // stock?: number

  // isAvailable?: boolean

  // currency?: string

  // 🖼️ Media
  // images?: string[]

  // 📊 Confidence
  confidence: ConfidenceReport

  // 🧠 Metadata
  normalization: NormalizationMeta

  // 🕓 Timestamps
  timestamps: ProductTimestamps

  
}