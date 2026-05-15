import {
  ProductAttributes
} from "../../types/normalized-product"

// ======================
// 📥 INPUT
// ======================

export type AiRefinementInput = {

  rawTitle: string

  normalizedTitle: string

  normalizedDescription?: string

  categoryPath: string[]

  attributes:
    ProductAttributes
}

// ======================
// 🛠️ CORRECTION RESULT
// ======================

export type AiCorrectionResult = {

  title: string

  categoryPath: string[]

  attributes:
    ProductAttributes

  confidence: number

  warnings?: string[]
}

// ======================
// ✨ ENRICHMENT RESULT
// ======================

export type AiEnrichmentResult = {

  shortDescription?: string

  description?: string

  seoTitle?: string

  seoDescription?: string

  keywords?: string[]
}

// export type AiRefinementResult = {

//   title: string

//   shortDescription?: string

//   description?: string

//   categoryPath: string[]

//   attributes: {

//     brand?: string | null

//     country?: string | null

//     material?: string | null

//     color?: string | null

//     model?: string | null

//     weight?: number | null

//     volume?: number | null

//     diameter?: number | null

//     height?: number | null

//     dimensions?: {
//       width?: number

//       height?: number

//       length?: number

//       unit?: string | null
//     } | null
//   }

//   seoTitle?: string

//   seoDescription?: string

//   confidence: number
// }