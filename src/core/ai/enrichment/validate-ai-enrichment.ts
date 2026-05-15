import {
  AiEnrichmentResult
} from "../ai.types"

export function validateAiEnrichment(
  data: any
): AiEnrichmentResult {

  if (
    !data ||
    typeof data !== "object"
  ) {

    throw new Error(
      "Invalid AI enrichment"
    )
  }

  return {

    shortDescription:
      data.shortDescription || null,

    description:
      data.description || null,

    seoTitle:
      data.seoTitle || null,

    seoDescription:
      data.seoDescription || null,

    keywords:
      Array.isArray(
        data.keywords
      )
        ? data.keywords
        : []
  }
}