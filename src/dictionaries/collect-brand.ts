import fs from "fs/promises"
import path from "path"

import { BRANDS }
from "./brands"

import { findInDictionary }
from "../core/normalization/find-in-dictionary"

// ======================
// 📁 FILE
// ======================

const FILE = path.join(
  process.cwd(),
  "data",
  "dictionaries",
  "brands",
  "pending.json"
)

// ======================
// 🧩 TYPES
// ======================

type BrandCandidate = {

  value: string

  detectedFrom: string

  sku?: string

  createdAt: string
}

// ======================
// 🏷️ COLLECT BRAND
// ======================

export async function collectBrand(
  brand: string | null,
  context?: {
    title?: string
    sku?: string
  }
) {

  // ======================
  // 🚫 EMPTY
  // ======================

  if (!brand) {
    return
  }

  // ======================
  // 🚫 ALREADY IN DICTIONARY
  // ======================

  const existsInDictionary =
    findInDictionary(
      brand,
      BRANDS
    )

  if (existsInDictionary) {
    return
  }

  try {

    // ======================
    // 📂 ENSURE DIR
    // ======================

    await fs.mkdir(
      path.dirname(FILE),
      {
        recursive: true
      }
    )

    // ======================
    // 📖 LOAD EXISTING
    // ======================

    let items: BrandCandidate[] = []

    try {

      const raw =
        await fs.readFile(
          FILE,
          "utf-8"
        )

      items = JSON.parse(raw)

    } catch {

      items = []
    }

    // ======================
    // 🚫 DUPLICATES
    // ======================

    const exists =
      items.find(
        (i) =>
          i.value.toLowerCase() ===
          brand.toLowerCase()
      )

    if (exists) {
      return
    }

    // ======================
    // ➕ ADD
    // ======================

    items.push({

      value: brand,

      detectedFrom:
        context?.title || "",

      sku:
        context?.sku,

      createdAt:
        new Date().toISOString()
    })

    // ======================
    // 💾 SAVE
    // ======================

    await fs.writeFile(
      FILE,
      JSON.stringify(
        items,
        null,
        2
      ),
      "utf-8"
    )

  } catch (e) {

    console.error(
      "collectBrand error",
      e
    )
  }
}