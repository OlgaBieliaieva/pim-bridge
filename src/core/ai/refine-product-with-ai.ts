import { geminiModel }
from "../../integrations/ai/gemini.client"

import { cleanAiJson }
from "../../integrations/ai/clean-ai-json"

import {
  AiRefinementInput,
  AiRefinementResult
} from "./ai.types"

import { buildProductAiPrompt }
from "./build-product-ai-prompt"

import { validateAiResponse }
from "./validate-ai-response"

export async function refineProductWithAi(
  product: AiRefinementInput
): Promise<AiRefinementResult> {

  const prompt =
    buildProductAiPrompt(product)

  const result =
    await geminiModel.generateContent(
      prompt
    )

  const response =
    await result.response

  const text =
    response.text()

  const cleaned =
    cleanAiJson(text)

  const parsed =
    JSON.parse(cleaned)

  return validateAiResponse(
    parsed
  )
}