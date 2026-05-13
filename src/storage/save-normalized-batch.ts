import fs from "fs/promises"
import path from "path"

export async function saveNormalizedBatch(
  runId: string,
  page: number,
  products: any[]
) {

  const dir = path.join(
    process.cwd(),
    "data",
    "prydane",
    "products",
    "normalized",
    runId
  )

  await fs.mkdir(dir, {
    recursive: true
  })

  const file = path.join(
    dir,
    `normalized_p_${page}.json`
  )

  await fs.writeFile(
    file,
    JSON.stringify(products, null, 2),
    "utf-8"
  )
}