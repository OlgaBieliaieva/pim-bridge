import fs from "fs/promises"
import path from "path"

export async function writeProcessingLog(
  runId: string,
  productId: string,
  payload: any
) {

  const dir = path.join(
    process.cwd(),
    "logs",
    "processing",
    runId
  )

  await fs.mkdir(dir, {
    recursive: true
  })

  const file = path.join(
    dir,
    `${productId}.json`
  )

  await fs.writeFile(
    file,
    JSON.stringify(payload, null, 2),
    "utf-8"
  )
}