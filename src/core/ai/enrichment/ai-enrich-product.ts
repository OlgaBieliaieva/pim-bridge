import {
  askOpenRouter
} from "../../../integrations/ai/providers/openrouter.provider"

import {
  cleanAiJson
} from "../../../integrations/ai/clean-ai-json"

import {
  AiEnrichmentResult
} from "../ai.types"

import {
  buildAiEnrichmentPrompt
} from "./build-ai-enrichment-prompt"

import {
  validateAiEnrichment
} from "./validate-ai-enrichment"

import {
  NormalizedProduct
} from "../../../types/normalized-product"

export async function aiEnrichProduct(
  product: NormalizedProduct
): Promise<AiEnrichmentResult> {

  // ======================
  // 🧠 PROMPT
  // ======================

  const prompt =
    buildAiEnrichmentPrompt(
      product
    )

  // ======================
  // 🤖 REQUEST
  // ======================

  const response =
    await askOpenRouter(
      prompt
    )

  // ======================
  // 🧹 CLEAN
  // ======================

  const cleaned =
    cleanAiJson(response)

  // ======================
  // 📦 PARSE
  // ======================

  const parsed =
    JSON.parse(cleaned)

  console.log(
    "AI enrichment:",
    parsed
  )

  // ======================
  // ✅ VALIDATE
  // ======================

  return validateAiEnrichment(
    parsed
  )
}