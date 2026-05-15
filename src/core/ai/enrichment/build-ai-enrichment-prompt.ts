import {
  NormalizedProduct
} from "../../../types/normalized-product"

export function buildAiEnrichmentPrompt(
  product: NormalizedProduct
): string {

  return `
You are an ecommerce SEO assistant.

Your task:
- generate concise ecommerce content
- use factual product data only
- do NOT invent specifications
- keep content human readable

Return ONLY valid JSON.

PRODUCT:

${JSON.stringify(product, null, 2)}

RULES:

1. shortDescription:
- 1-2 sentences
- concise
- readable
- may include key attributes

2. description:
- optional
- small ecommerce description
- avoid keyword spam

3. seoTitle:
- SEO friendly
- concise
- human readable
- max 60 chars

4. seoDescription:
- max 160 chars
- natural language
- ecommerce style

5. keywords:
- array of relevant keywords
- no spam

RETURN JSON:

{
  "shortDescription": string | null,
  "description": string | null,
  "seoTitle": string | null,
  "seoDescription": string | null,
  "keywords": string[]
}
`
}