import fs from "fs/promises"

import path from "path"

import {CategoryNode} from "../types"

const RAW_DIR =
  path.join(
    process.cwd(),
    "data",
    "prydane",
    "taxonomy",
    "raw"
  )

export async function loadCategories():
Promise<CategoryNode[]> {

  const files =
    await fs.readdir(RAW_DIR)

  const jsonFiles =
    files.filter(
      (f: string) =>
        f.endsWith(".json")
    )

  const result:
    CategoryNode[] = []

  for (const file of jsonFiles) {

    const fullPath =
      path.join(
        RAW_DIR,
        file
      )

    const raw =
      await fs.readFile(
        fullPath,
        "utf-8"
      )

    const items =
      JSON.parse(raw)

    result.push(...items)
  }

  return result
}