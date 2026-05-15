import {
  askOpenRouter
} from "./providers/openrouter.provider"

export async function testOpenRouter() {

  const result =
    await askOpenRouter(`
Return JSON only:

{
  "title": string
}

Normalize:
"\"Стрічка органза з оксамитовою крапкою 4см-124 Grey 60676 .\"
`)

  console.log(result)
}