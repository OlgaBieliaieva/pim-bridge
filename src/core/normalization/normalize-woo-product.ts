import {
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
  cleanText,
  inferCountryFromBrand
} from "./extractors"

import { collectBrand } from "../../dictionaries/collect-brand"

import { cleanQuotes, stripHtml } from "../../utils/text"

import { WooProduct } from "../../types/woocommerce.types"

import { NormalizedProduct } from "../../types/normalized-product"

import { calculateConfidence } from "../confidence/calculate-confidence"

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

  const detectedCountry =
    extractCountry(
      workingTitle
    )

  let country =
    detectedCountry
      ? {
          value:
            detectedCountry,

          source:
            "dictionary" as const,

          confidence: 1,

          requiresReview:
            false
        }
      : undefined

  if (country?.value) {

    workingTitle =
      removeExtractedData(
        workingTitle,
        [country.value]
      )
  }

  // ======================
  // 🧱 MATERIAL
  // ======================

  const detectedMaterial =
    extractMaterial(
      workingTitle
    )

  const material =
    detectedMaterial
      ? {
          value:
            detectedMaterial,

          source:
            "dictionary" as const,

          confidence: 1,

          requiresReview:
            false
        }
      : undefined

  if (material?.value) {

    workingTitle =
      removeExtractedData(
        workingTitle,
        [material.value]
      )
  }

  // ======================
  // 🎨 COLOR
  // ======================

  const detectedColor =
    extractColor(
      workingTitle
    )

  const color =
    detectedColor
      ? {
          value:
            detectedColor,

          source:
            "dictionary" as const,

          confidence: 1,

          requiresReview:
            false
        }
      : undefined

  if (color?.value) {

    workingTitle =
      removeExtractedData(
        workingTitle,
        [color.value]
      )
  }

  // ======================
  // ⚖️ WEIGHT
  // ======================

  const detectedWeight =
    extractWeight(
      workingTitle
    )

  const weight =
    detectedWeight
      ? {
          value:
            detectedWeight,

          source:
            "regex" as const,

          confidence: 0.9,

          requiresReview:
            false
        }
      : undefined

  if (weight?.value) {

    workingTitle =
      workingTitle.replace(
        /(\d+(?:[.,]\d+)?)\s?(г|гр|кг)/iu,
        ""
      )
  }

  // ======================
  // 🧴 VOLUME
  // ======================

  const detectedVolume =
    extractVolume(
      workingTitle
    )

  const volume =
    detectedVolume
      ? {
          value:
            detectedVolume,

          source:
            "regex" as const,

          confidence: 0.9,

          requiresReview:
            false
        }
      : undefined

  if (volume?.value) {

    workingTitle =
      workingTitle.replace(
        /(\d+(?:[.,]\d+)?)\s?(мл|л)/iu,
        ""
      )
  }

  // ======================
  // 📏 DIMENSIONS
  // ======================

  const detectedDimensions =
    extractDimensions(
      workingTitle
    )

  const dimensions =
    detectedDimensions
      ? {
          value:
            detectedDimensions,

          source:
            "regex" as const,

          confidence:
            0.85,

          requiresReview:
            false
        }
      : undefined

  if (dimensions?.value) {

    workingTitle =
      workingTitle.replace(
        /\(?\s?\d+(?:[.,]\d+)?\s?[xх*]\s?\d+(?:[.,]\d+)?(?:\s?[xх*]\s?\d+(?:[.,]\d+)?)?\s?(см|мм|mm)?\s?\)?/iu,
        ""
      )
  }

  // ======================
  // ⭕ DIAMETER
  // ======================

  const detectedDiameter =
    extractDiameter(
      workingTitle
    )

  const diameter =
    detectedDiameter
      ? {
          value:
            detectedDiameter,

          source:
            "regex" as const,

          confidence: 0.9,

          requiresReview:
            false
        }
      : undefined

  if (diameter?.value) {

    workingTitle =
      workingTitle.replace(
        /(д\.|d|ø|діаметр)\s?\d+(?:[.,]\d+)?\s?мм/iu,
        ""
      )
  }

  // ======================
  // 📐 HEIGHT
  // ======================

  const detectedHeight =
    extractHeight(
      workingTitle
    )

  const height =
    detectedHeight
      ? {
          value:
            detectedHeight,

          source:
            "regex" as const,

          confidence: 0.9,

          requiresReview:
            false
        }
      : undefined

  if (height?.value) {

    workingTitle =
      workingTitle.replace(
        /(h[-\s]?|висота)\d+(?:[.,]\d+)?\s?мм/iu,
        ""
      )
  }

  // ======================
  // 🏷️ BRAND
  // ======================

  const brandResult =
    extractBrand(
      workingTitle,
      {
        country:
          country?.value,

        material:
          material?.value,

        color:
          color?.value,

        weight: weight?.value,

        volume: volume?.value,

        dimensions,

        diameter: diameter?.value,

        height: height?.value
      }
    )

  let brand:
    | {
        value: string

        source:
          | "dictionary"
          | "regex"

        confidence: number

        requiresReview: boolean
      }
    | undefined

  // ======================
  // ✅ VERIFIED BRAND
  // ======================

  if (
    brandResult.confidence ===
    "high"
  ) {

    brand = {

      value:
        brandResult.brand!,

      source:
        "dictionary",

      confidence: 1,

      requiresReview:
        false
    }

    workingTitle =
      removeExtractedData(
        workingTitle,
        [brand.value]
      )
  }

  // ======================
  // 🟡 CANDIDATE BRAND
  // ======================

  if (
    brandResult.brand &&
    brandResult.confidence ===
      "low"
  ) {

    brand = {

      value:
        brandResult.brand,

      source:
        "regex",

      confidence: 0.4,

      requiresReview:
        true
    }

    await collectBrand(
      brandResult.brand,
      {
        title:
          cleanedTitle,

        sku:
          product.sku
      }
    )
  }

  // ======================
  // 🌍 INFER COUNTRY
  // ======================

  if (
    !country &&
    brand &&
    brand.source ===
      "dictionary"
  ) {

    const inferredCountry =
      inferCountryFromBrand(
        brand.value
      )

    if (inferredCountry) {

      country = {

        value:
          inferredCountry,

        source:
          "dictionary",

        confidence: 0.95,

        requiresReview:
          false
      }
    }
  }


  // ======================
  // 🔢 MODEL (LAST)
  // ======================

  const detectedModel =
    extractModel(
      workingTitle
    )

  const model =
    detectedModel
      ? {
          value:
            detectedModel,

          source:
            "regex" as const,

          confidence: 0.35,

          requiresReview:
            true
        }
      : undefined

  if (model?.value) {

    workingTitle =
      removeExtractedData(
        workingTitle,
        [model.value]
      )
  }

  // // ======================
  // // 📦 BARCODE
  // // ======================

  // const barcode =
  //   extractBarcode(
  //     product.attributes
  //   )

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
        brand?.value || null,
        country?.value || null
      ]
    )

  // ======================
  // 📊 CONFIDENCE
  // ======================

  // ======================
// 📊 CONFIDENCE
// ======================

const confidence =
  calculateConfidence({

    title:
      normalizedTitle,

    categoryPath,

    brand:
      brand?.value,

    country:
      country?.value,

    material:
      material?.value,

    color:
      color?.value,

    model:
      model?.value,

    weight:
      weight?.value,

    volume:
      volume?.value,

    dimensions:
      dimensions?.value,

    diameter:
      diameter?.value,

    height:
      height?.value
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

      // barcode
    },

    // price:
    //   Number(product.price),

    // stock:
    //   product.stock_quantity || 0,

    // isAvailable:
    //   product.stock_status ===
    //   "instock",

    // images:
    //   product.images.map(
    //     (i) => i.src
    //   ),

    confidence,

    normalization: {

      version: "v5",

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