import fs from "fs"
import path from "path"

export function writeProcessingLog(
  productId: string,
  data: any
) {
  const date = new Date().toISOString().slice(0, 10)

  const dir = path.join(
    process.cwd(),
    "logs",
    "processing",
    date
  )

  fs.mkdirSync(dir, { recursive: true })

  const file = path.join(dir, `${productId}.json`)

  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2),
    "utf-8"
  )
}