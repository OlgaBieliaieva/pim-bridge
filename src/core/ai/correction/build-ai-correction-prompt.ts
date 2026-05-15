import { AiRefinementInput } from "../ai.types"

export function buildAiCorrectionPrompt(
  product: AiRefinementInput
): string {

  return `
You are a product normalization AI.

Your task:
- analyze RAW product title
- validate deterministic extraction
- correct suspicious attributes
- DO NOT invent facts
- preserve dictionary-derived values unless clearly wrong

Return ONLY valid JSON.

PRODUCT:

${JSON.stringify(product, null, 2)}

RULES:

1. Dictionary attributes:
- source = "dictionary"
- confidence >= 0.95
- treat as trusted
- only change if obviously incorrect

2. Regex attributes:
- may be incorrect
- validate carefully

3. AI may suggest:
- missing brand
- corrected model
- corrected dimensions
- corrected color
- corrected material

4. If AI is unsure:
- return null

5. Keep title:
- short
- clean
- readable
- without duplicated attributes

6. Do NOT:
- invent brands
- invent dimensions
- invent categories

RETURN JSON:

{
  "title": string,
  "categoryPath": string[],
  "attributes": {
    "brand": {
      "value": string | null,
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    },

    "country": {
      "value": string | null,
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    },

    "material": {
      "value": string | null,
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    },

    "color": {
      "value": string | null,
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    },

    "model": {
      "value": string | null,
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    },

    "weight": {
      "value": number | null,
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    },

    "volume": {
      "value": number | null,
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    },

    "diameter": {
      "value": number | null,
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    },

    "height": {
      "value": number | null,
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    },

    "dimensions": {
      "value": {
        "width": number | null,
        "height": number | null,
        "length": number | null,
        "unit": string | null
      },
      "source": "ai",
      "confidence": number,
      "requiresReview": boolean
    }
  },

  "confidence": number,

  "warnings": string[]
}
`
}