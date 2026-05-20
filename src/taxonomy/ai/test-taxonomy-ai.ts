import "dotenv/config"

import fs from "fs/promises"

import path from "path"

import {
  exportTaxonomyForAi
} from "./export-taxonomy-for-ai"

import {
  optimizeTaxonomyWithAi
} from "./optimize-taxonomy-with-ai"

import {
  splitTaxonomyIntoChunks
} from "./split-taxonomy-into-chunks"

import {
  estimateTokens
} from "../../integrations/ai/estimate-tokens"

async function main() {

  // ======================
  // 📥 LOAD TREE
  // ======================

  const inputPath =
    path.join(
      process.cwd(),
      "data",
      "prydane",
      "taxonomy",
      "normalized",
      "normalized-category-tree.json"
    )

  const raw =
    await fs.readFile(
      inputPath,
      "utf-8"
    )

  const tree =
    JSON.parse(raw)

  // ======================
  // ✂️ SPLIT INTO CHUNKS
  // ======================

  const chunks =
    splitTaxonomyIntoChunks(
      tree
    )

  console.log(
    `Total chunks: ${chunks.length}`
  )

  // ======================
  // 📦 RESULTS
  // ======================

  const proposals = []

  // ======================
  // 🔁 PROCESS CHUNKS
  // ======================

  for (const chunk of chunks) {

    console.log(
      `\n======================`
    )

    console.log(
      `🧠 Processing: ${chunk.rootName}`
    )

    console.log(
      `======================`
    )

    try {

      // ======================
      // 🤖 EXPORT FOR AI
      // ======================

      const aiTree =
        exportTaxonomyForAi(
          chunk.nodes
        )

      // ======================
      // 📊 TOKEN ESTIMATION
      // ======================

      const estimatedTokens =
        estimateTokens(
          JSON.stringify(
            aiTree
          )
        )

      console.log(
        "Estimated tokens:",
        estimatedTokens
      )

      // ======================
      // 🚨 SAFETY LIMIT
      // ======================

      if (
        estimatedTokens > 8000
      ) {

        console.warn(
          `⚠️ Skipped ${chunk.rootName}: too large`
        )

        continue
      }

      // ======================
      // 🧠 AI OPTIMIZATION
      // ======================

      const proposal =
        await optimizeTaxonomyWithAi(
          aiTree
        )

      // ======================
      // 💾 STORE RESULT
      // ======================

      proposals.push({

        rootId:
          chunk.rootId,

        rootName:
          chunk.rootName,

        proposal
      })

      console.log(
        `✅ Done: ${chunk.rootName}`
      )

      // ======================
      // 💤 THROTTLING
      // ======================

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            2000
          )
      )

    } catch (e) {

      console.error(
        `❌ Failed chunk: ${chunk.rootName}`
      )

      console.error(e)
    }
  }

  // ======================
  // 💾 SAVE RESULTS
  // ======================

  const outputPath =
    path.join(
      process.cwd(),
      "data",
      "prydane",
      "taxonomy",
      "ai",
      "taxonomy-proposals.json"
    )

  await fs.mkdir(
    path.dirname(
      outputPath
    ),
    {
      recursive: true
    }
  )

  await fs.writeFile(
    outputPath,

    JSON.stringify(
      proposals,
      null,
      2
    ),

    "utf-8"
  )

  console.log(
    `\n✅ AI proposals saved:`
  )

  console.log(
    outputPath
  )
}

main()