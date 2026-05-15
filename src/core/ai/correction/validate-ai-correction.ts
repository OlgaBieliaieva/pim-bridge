import { AiCorrectionResult } from "../ai.types"

export function validateAiCorrection(
  data: any
): AiCorrectionResult {

  if (
    !data ||
    typeof data !== "object"
  ) {

    throw new Error(
      "Invalid AI correction response"
    )
  }

  if (
    typeof data.title !==
    "string"
  ) {

    throw new Error(
      "AI correction missing title"
    )
  }

  if (
    !Array.isArray(
      data.categoryPath
    )
  ) {

    throw new Error(
      "AI correction missing categoryPath"
    )
  }

  if (
    typeof data.attributes !==
    "object"
  ) {

    throw new Error(
      "AI correction missing attributes"
    )
  }

  return data
}