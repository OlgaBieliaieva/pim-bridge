import {

  extractBarcode,

  extractBrand,

  extractColor,

  extractCountry,

  extractDiameter,

  extractDimensions,

  extractHeight,

  extractMaterial,

  extractModel,

  extractVolume,

  extractWeight,

  removeExtractedData,

  cleanText

} from "./extractors"

import { collectBrand }
from "../../dictionaries/collect-brand"

import {

  cleanQuotes,

  stripHtml

} from "../../utils/text"

import { WooProduct }
from "../../types/woocommerce.types"

import { NormalizedProduct }
from "../../types/normalized-product"

import { calculateConfidence }
from "../confidence/calculate-confidence"

export async function normalizeWooProduct(
  product: WooProduct
): Promise<NormalizedProduct> {

  // ======================
  // 🧾 RAW
  // ======================

  const rawTitle =
    product.name || ""

  const rawDescription =
    stripHtml(
      product.description || ""
    )

  // ======================
  // 🧹 CLEAN BASE
  // ======================

  const cleanedTitle =
    cleanText(
      cleanQuotes(rawTitle)
    )

  const cleanedDescription =
    cleanText(
      cleanQuotes(rawDescription)
    )

  // ======================
  // 🧠 WORKING TITLE
  // ======================

  let workingTitle =
    cleanedTitle

  // ======================
  // 📂 CATEGORY
  // ======================

  const categoryPath =
    product.categories.map(
      (c) => c.name
    )

  // ======================
  // 🌍 COUNTRY
  // ======================

  const country =
    extractCountry(
      workingTitle
    )

  if (country) {

    workingTitle =
      removeExtractedData(
        workingTitle,
        [country]
      )
  }

  // ======================
  // 🧱 MATERIAL
  // ======================

  const material =
    extractMaterial(
      workingTitle
    )

  if (material) {

    workingTitle =
      removeExtractedData(
        workingTitle,
        [material]
      )
  }

  // ======================
  // 🎨 COLOR
  // ======================

  const color =
    extractColor(
      workingTitle
    )

  if (color) {

    workingTitle =
      removeExtractedData(
        workingTitle,
        [color]
      )
  }

  // ======================
  // 🏷️ BRAND
  // ======================

  const brand =
    extractBrand(
      workingTitle,
      country,
      null
    )

  if (brand) {

    workingTitle =
      removeExtractedData(
        workingTitle,
        [brand]
      )
  }

  await collectBrand(
    brand,
    {
      title: cleanedTitle,
      sku: product.sku
    }
  )

  // ======================
  // ⚖️ WEIGHT
  // ======================

  const weight =
    extractWeight(
      workingTitle
    )

  if (weight) {

    workingTitle =
      workingTitle.replace(
        /(\d+(?:[.,]\d+)?)\s?(г|гр|кг)/iu,
        ""
      )
  }

  // ======================
  // 🧴 VOLUME
  // ======================

  const volume =
    extractVolume(
      workingTitle
    )

  if (volume) {

    workingTitle =
      workingTitle.replace(
        /(\d+(?:[.,]\d+)?)\s?(мл|л)/iu,
        ""
      )
  }

  // ======================
  // 📏 DIMENSIONS
  // ======================

  const dimensions =
    extractDimensions(
      workingTitle
    )

  if (dimensions) {

    workingTitle =
      workingTitle.replace(
        /\(?\s?\d+(?:[.,]\d+)?\s?[xх*]\s?\d+(?:[.,]\d+)?(?:\s?[xх*]\s?\d+(?:[.,]\d+)?)?\s?(см|мм|mm)?\s?\)?/iu,
        ""
      )
  }

  // ======================
  // ⭕ DIAMETER
  // ======================

  const diameter =
    extractDiameter(
      workingTitle
    )

  if (diameter) {

    workingTitle =
      workingTitle.replace(
        /(д\.|d|ø|діаметр)\s?\d+(?:[.,]\d+)?\s?мм/iu,
        ""
      )
  }

  // ======================
  // 📐 HEIGHT
  // ======================

  const height =
    extractHeight(
      workingTitle
    )

  if (height) {

    workingTitle =
      workingTitle.replace(
        /(h[-\s]?|висота)\d+(?:[.,]\d+)?\s?мм/iu,
        ""
      )
  }

  // ======================
  // 🔢 MODEL (LAST)
  // ======================

  const model =
    extractModel(
      workingTitle
    )

  if (model) {

    workingTitle =
      removeExtractedData(
        workingTitle,
        [model]
      )
  }

  // ======================
  // 📦 BARCODE
  // ======================

  const barcode =
    extractBarcode(
      product.attributes
    )

  // ======================
  // ✨ FINAL TITLE
  // ======================

  const normalizedTitle =
    cleanText(
      workingTitle
    )

  // ======================
  // ✨ DESCRIPTION
  // ======================

  const normalizedDescription =
    removeExtractedData(
      cleanedDescription,
      [
        brand,
        country
      ]
    )

  // ======================
  // 📊 CONFIDENCE
  // ======================

  const confidence =
    calculateConfidence({

      title:
        normalizedTitle,

      categoryPath,

      brand,

      country,

      material,

      color,

      model,

      weight,

      volume,

      dimensions,

      diameter,

      height,

      barcode
    })

  // ======================
  // ✅ RESULT
  // ======================

  return {

    source: "woocommerce",

    externalId:
      String(product.id),

    sku:
      product.sku,

    rawTitle,

    normalizedTitle,

    rawDescription,

    normalizedDescription,

    slug:
      product.slug,

    categoryPath,

    attributes: {

      brand,

      country,

      material,

      color,

      model,

      weight,

      volume,

      dimensions,

      diameter,

      height,

      barcode
    },

    price:
      Number(product.price),

    stock:
      product.stock_quantity || 0,

    isAvailable:
      product.stock_status ===
      "instock",

    images:
      product.images.map(
        (i) => i.src
      ),

    confidence,

    normalization: {

      version: "v3",

      strategy:
        "deterministic"
    },

    timestamps: {

      createdAt:
        product.date_created,

      updatedAt:
        product.date_modified
    }
  }
}