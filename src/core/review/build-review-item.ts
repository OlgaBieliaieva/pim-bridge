import {
  ProductAttributes
} from "../../types/normalized-product"

import {
  ReviewIssue,
  ReviewQueueItem
} from "./review.types"

type Params = {

  productId: string

  sku: string

  rawTitle: string

  normalizedTitle: string

  categoryPath: string[]

  deterministicAttributes:
    ProductAttributes

  aiAttributes?:
    ProductAttributes

  finalAttributes:
    ProductAttributes
}

export function buildReviewItem(
  params: Params
): ReviewQueueItem | null {

  const issues:
    ReviewIssue[] = []

  // ======================
  // 🔴 EMPTY TITLE
  // ======================

  if (
    !params.normalizedTitle
      .trim()
  ) {

    issues.push(
      "empty_title"
    )
  }

  // ======================
  // 🟡 REGEX ATTRIBUTES
  // ======================

  for (
    const attr of Object.values(
      params.finalAttributes
    )
  ) {

    if (
      attr?.source === "regex"
    ) {

      issues.push(
        "regex_attribute"
      )

      break
    }
  }

  // ======================
  // 🟠 REQUIRES REVIEW
  // ======================

  for (
    const attr of Object.values(
      params.finalAttributes
    )
  ) {

    if (
      attr?.requiresReview
    ) {

      issues.push(
        "low_confidence_ai"
      )

      break
    }
  }

  // ======================
  // 🔵 MISSING BRAND
  // ======================

  if (
    !params.finalAttributes
      .brand?.value
  ) {

    issues.push(
      "missing_brand"
    )
  }

  // ======================
  // ❌ NO ISSUES
  // ======================

  if (!issues.length) {
    return null
  }

  return {

    productId:
      params.productId,

    sku:
      params.sku,

    rawTitle:
      params.rawTitle,

    normalizedTitle:
      params.normalizedTitle,

    categoryPath:
      params.categoryPath,

    issues,

    deterministicAttributes:
      params.deterministicAttributes,

    aiAttributes:
      params.aiAttributes,

    finalAttributes:
      params.finalAttributes,

    createdAt:
      new Date().toISOString()
  }
}