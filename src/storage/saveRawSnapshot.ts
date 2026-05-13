import fs from "fs"
import path from "path"

export function saveRawSnapshot(
  source: string,
  id: string,
  payload: any
) {
  const dir = path.join(
    process.cwd(),
    "data",
    "raw",
    source
  )

  fs.mkdirSync(dir, { recursive: true })

  fs.writeFileSync(
    path.join(dir, `${id}.json`),
    JSON.stringify(payload, null, 2)
  )
}