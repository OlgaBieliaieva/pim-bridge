import fs from "fs/promises"

import path from "path"

import { normalizeCategoryTree }
from "./normalize-category-tree"

async function main() {

  // ======================
  // 📥 LOAD CANONICAL
  // ======================

  const inputPath =
    path.join(
      process.cwd(),
      "data",
      "prydane",
      "taxonomy",
      "canonical",
      "category-tree.json"
    )

  const raw =
    await fs.readFile(
      inputPath,
      "utf-8"
    )

  const tree =
    JSON.parse(raw)

  // ======================
  // ✨ NORMALIZE
  // ======================

  const normalized =
    normalizeCategoryTree(
      tree
    )

  // ======================
  // 💾 SAVE
  // ======================

  const outputPath =
    path.join(
      process.cwd(),
      "data",
      "prydane",
      "taxonomy",
      "normalized",
      "normalized-category-tree.json"
    )

  await fs.mkdir(
    path.dirname(outputPath),
    {
      recursive: true
    }
  )

  await fs.writeFile(
    outputPath,
    JSON.stringify(
      normalized,
      null,
      2
    ),
    "utf-8"
  )

  console.log(
    "Normalized tree saved:",
    outputPath
  )
}

main()