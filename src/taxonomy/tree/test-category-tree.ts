import path from "path"

import { loadCategories } from "../loaders/load-categories"

import { buildCategoryTree } from "./build-category-tree"

import { saveCategoryTree } from "./save-category-tree"

async function main() {

  // ======================
  // 📥 LOAD
  // ======================

  const categories =
    await loadCategories()

  console.log(
    "Loaded categories:",
    categories.length
  )

  // ======================
  // 🌳 BUILD TREE
  // ======================

  const tree =
    buildCategoryTree(
      categories
    )

  console.log(
    "Root categories:",
    tree.length
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
      "canonical",
      "category-tree.json"
    )

  await saveCategoryTree(
    tree,
    outputPath
  )
}

main()