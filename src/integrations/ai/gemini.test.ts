import { geminiModel }
from "./gemini.client"

import { cleanAiJson }
from "./clean-ai-json"

export async function testGemini() {

  const prompt = `
Normalize this product title:

"Сироп "" Гренадін "" 270мл MARIBELL ."

Return ONLY valid JSON.

Schema:
{
  "cleanTitle": string,
  "brand": string | null,
  "volume": number | null
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