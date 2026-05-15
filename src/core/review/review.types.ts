import {
  ProductAttributes
} from "../../types/normalized-product"

export type ReviewIssue =

  | "low_confidence_ai"
  | "regex_attribute"
  | "ai_dictionary_conflict"
  | "missing_brand"
  | "suspicious_model"
  | "empty_title"

export type ReviewQueueItem = {

  productId: string

  sku: string

  rawTitle: string

  normalizedTitle: string

  categoryPath: string[]

  issues: ReviewIssue[]

  deterministicAttributes:
    ProductAttributes

  aiAttributes?:
    ProductAttributes

  finalAttributes:
    ProductAttributes

  createdAt: string
}