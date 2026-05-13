import fs from "fs/promises"
import path from "path"

const FILE =
  path.join(
    process.cwd(),
    "data",
    "dictionaries",
    "unknown_tokens.json"
  )

type UnknownToken = {
  token: string
  type: string
  createdAt: string
}

export async function logUnknownToken(
  token: string,
  type: string
) {

  if (!token?.trim()) {
    return
  }

  try {

    const raw =
      await fs.readFile(
        FILE,
        "utf-8"
      )

    const items: UnknownToken[] =
      JSON.parse(raw)

    const exists =
      items.find(
        (i) =>
          i.token === token &&
          i.type === type
      )

    if (exists) {
      return
    }

    items.push({
      token,
      type,
      createdAt:
        new Date().toISOString()
    })

    await fs.writeFile(
      FILE,
      JSON.stringify(items, null, 2),
      "utf-8"
    )

  } catch (e) {

    console.error(
      "Unknown token log error",
      e
    )
  }
}