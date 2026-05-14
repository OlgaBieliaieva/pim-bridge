import {
  AiRefinementResult
} from "./ai.types"

export function validateAiResponse(
  data: any
): AiRefinementResult {

  if (!data.title) {

    throw new Error(
      "AI response missing title"
    )
  }

  if (
    !Array.isArray(
      data.categoryPath
    )
  ) {

    throw new Error(
      "AI response missing categoryPath"
    )
  }

  return data
}