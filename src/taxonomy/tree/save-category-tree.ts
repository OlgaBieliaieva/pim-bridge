import fs from "fs/promises"

export async function saveCategoryTree(
  tree: any,
  outputPath: string
) {

  await fs.writeFile(
    outputPath,
    JSON.stringify(tree, null, 2),
    "utf-8"
  )

  console.log(
    `Category tree saved to: ${outputPath}`
  )
}