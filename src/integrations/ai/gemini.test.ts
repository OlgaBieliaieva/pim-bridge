import { geminiModel } from "./gemini.client"

import { cleanAiJson } from "./clean-ai-json"

export async function testGemini() {

  const prompt = `
Normalize this product title:

"\"Банка для меду з ложкою на бамбуковій підставці 11*11*12см скло R99353 .\""

Return ONLY valid JSON.

Schema:
{
  "cleanTitle": string,
  "brand": string | null,
  "volume": number | null,    
  "country": string | null
  "model": string | null
  "weight": number | null
  "volume": number | null  
  "diameter": number | null
  "height": number | null
}
`

  const result =
    await geminiModel.generateContent(
      prompt
    )

  const response =
    await result.response

  const rawText =
    response.text()

  const cleaned =
    cleanAiJson(rawText)

  const parsed =
    JSON.parse(cleaned)

  console.log(parsed)

  return parsed
}