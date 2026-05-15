import {
  askOpenRouter
} from "../../../integrations/ai/providers/openrouter.provider"

import {
  cleanAiJson
} from "../../../integrations/ai/clean-ai-json"

import {
  AiCorrectionResult,
  AiRefinementInput
} from "../ai.types"

import {
  buildAiCorrectionPrompt
} from "./build-ai-correction-prompt"

import {
  validateAiCorrection
} from "./validate-ai-correction"

export async function aiCorrectProduct(
  product: AiRefinementInput
): Promise<AiCorrectionResult> {

  // ======================
  // 🧠 PROMPT
  // ======================

  const prompt =
    buildAiCorrectionPrompt(
      product
    )

  // ======================
  // 🤖 AI REQUEST
  // ======================

  const response =
    await askOpenRouter(
      prompt
    )

  // ======================
  // 🧹 CLEAN JSON
  // ======================

  const cleaned =
    cleanAiJson(response)

  // ======================
  // 📦 PARSE
  // ======================

  const parsed =
    JSON.parse(cleaned)

  console.log(
    "AI correction:",
    parsed
  )

  // ======================
  // ✅ VALIDATE
  // ======================

  return validateAiCorrection(
    parsed
  )
}