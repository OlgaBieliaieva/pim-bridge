import axios from "axios"

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions"

export async function askOpenRouter(
  prompt: string
) {

  const response =
  await axios.post(

    OPENROUTER_URL,

    {
      model:
        "openai/gpt-oss-120b:free",

      messages: [
        {
          role: "user",
          content: prompt
        }
      ],

      temperature: 0.1
    },

    {
      headers: {
        Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

        "Content-Type":
          "application/json",

        "HTTP-Referer":
          "http://localhost:3000",

        "X-Title":
          "PIM Bridge"
      }
    }
  )

  return response
    .data
    .choices?.[0]
    ?.message
    ?.content
}