import {
  AiRefinementInput
} from "./ai.types"

export function buildProductAiPrompt(
  product: AiRefinementInput
): string {

  return `
You are a PIM AI normalization engine.

Your task:
- improve normalized product data
- fix incorrect attributes
- improve title quality
- keep factual information only
- do NOT invent data

Return ONLY valid JSON.

INPUT:

${JSON.stringify(product, null, 2)}

RULES:

1. title:
- clean
- short
- readable
- no duplicated attributes
- no garbage punctuation

2. brand:
- detect only if confident

3. categoryPath:
- keep existing unless clearly wrong

4. attributes:
- preserve correct values
- remove incorrect values

5. confidence:
- number from 0 to 1

JSON SCHEMA:

{
  "title": string,
  "description": string | null,
  "categoryPath": string[],
  "attributes": {
    "brand": string | null,
    "country": string | null,
    "material": string | null,
    "color": string | null,
    "model": string | null,
    "weight": number | null,
    "volume": number | null,
    "diameter": number | null,
    "height": number | null
  },
  "seoTitle": string | null,
  "confidence": number
}
`
}