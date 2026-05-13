import fs from "fs/promises"
import path from "path"

import { WooProduct }
from "../../types/woocommerce.types"

import { normalizeWooProduct }
from "../normalization/normalize-woo-product"

import { saveNormalizedBatch }
from "../../storage/save-normalized-batch"

import { writeProcessingLog }
from "../logging/write-processing-log"

export async function processWooRun(
  runId: string
) {

  const rawDir = path.join(
    process.cwd(),
    "data",
    "prydane",
    "products",
    "raw",
    runId
  )

  const files =
    await fs.readdir(rawDir)

  const productFiles = files.filter(
    (f) =>
      f.startsWith("products_p_")
  )

  for (const file of productFiles) {

    console.log(`⚙️ Processing ${file}`)

    const pageMatch =
      file.match(/p_(\d+)/)

    const page =
      pageMatch
        ? Number(pageMatch[1])
        : 1

    const filePath = path.join(
      rawDir,
      file
    )

    const raw =
      await fs.readFile(
        filePath,
        "utf-8"
      )

    const products:
      WooProduct[] =
      JSON.parse(raw)

    const normalized = []

    for (const product of products) {

      try {

        const result =
          await normalizeWooProduct(
            product
          )

        normalized.push(result)

        await writeProcessingLog(
          runId,
          result.externalId,
          {
            status: "success",

            normalizedAt:
              new Date()
                .toISOString(),

            confidence:
              result.confidence,

            normalization:
              result.normalization
          }
        )

      } catch (error) {

        await writeProcessingLog(
          runId,
          String(product.id),
          {
            status: "failed",

            error
          }
        )
      }
    }

    await saveNormalizedBatch(
      runId,
      page,
      normalized
    )

    console.log(
      `✅ Normalized ${normalized.length} products`
    )
  }

  console.log(
    `🎉 Run ${runId} completed`
  )
}