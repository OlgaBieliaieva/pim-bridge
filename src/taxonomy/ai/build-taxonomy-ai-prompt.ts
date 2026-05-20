import {
  AiTaxonomyNode
} from "./taxonomy-ai.types"

export function buildTaxonomyAiPrompt(
  tree: AiTaxonomyNode[]
): string {

  return `
You are a STRICT ecommerce taxonomy optimizer.

Your task:
- improve readability
- fix spelling
- expand abbreviations
- improve SEO naming quality

STRICT RULES:

- preserve original language
- NEVER translate categories
- NEVER invent product meanings
- NEVER add attributes not present in original meaning
- NEVER change business semantics
- NEVER guess ambiguous abbreviations
- if uncertain → add warning instead

Allowed operations:
- spelling fixes
- pluralization
- abbreviation expansion
- word order improvement
- typo correction

Forbidden:
- translations
- invented clarifications
- semantic reinterpretation
- adding descriptors
- changing product type

Return ONLY valid JSON.

INPUT TREE:

${JSON.stringify(tree, null, 2)}

OUTPUT FORMAT:

{
  "renames": [
    {
      "id": number,
      "oldName": string,
      "newName": string,
      "reason": string
    }
  ],

  "moves": [
    {
      "id": number,
      "oldParent": number,
      "newParent": number,
      "reason": string
    }
  ],

  "merges": [
    {
      "sourceIds": number[],
      "targetId": number,
      "reason": string
    }
  ],

  "warnings": string[]
}
`
}