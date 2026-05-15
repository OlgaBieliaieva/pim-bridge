import {
  ProductAttributes
} from "../../../types/normalized-product"

import {
  AiCorrectionResult
} from "../ai.types"

import {
  mergeAttribute
} from "./merge-attribute"

type Params = {

  deterministicTitle:
    string

  deterministicAttributes:
    ProductAttributes

  aiCorrection:
    AiCorrectionResult
}

export function mergeAiRefinement({
  deterministicTitle,
  deterministicAttributes,
  aiCorrection
}: Params) {

  // ======================
  // 🧩 ATTRIBUTES
  // ======================

  const attributes:
    ProductAttributes = {

    brand:
      mergeAttribute(
        deterministicAttributes.brand,
        aiCorrection.attributes
          .brand
      ),

    country:
      mergeAttribute(
        deterministicAttributes.country,
        aiCorrection.attributes
          .country
      ),

    material:
      mergeAttribute(
        deterministicAttributes.material,
        aiCorrection.attributes
          .material
      ),

    color:
      mergeAttribute(
        deterministicAttributes.color,
        aiCorrection.attributes
          .color
      ),

    model:
      mergeAttribute(
        deterministicAttributes.model,
        aiCorrection.attributes
          .model
      ),

    weight:
      mergeAttribute(
        deterministicAttributes.weight,
        aiCorrection.attributes
          .weight
      ),

    volume:
      mergeAttribute(
        deterministicAttributes.volume,
        aiCorrection.attributes
          .volume
      ),

    diameter:
      mergeAttribute(
        deterministicAttributes.diameter,
        aiCorrection.attributes
          .diameter
      ),

    height:
      mergeAttribute(
        deterministicAttributes.height,
        aiCorrection.attributes
          .height
      ),

    dimensions:
      mergeAttribute(
        deterministicAttributes
          .dimensions,
        aiCorrection.attributes
          .dimensions
      )
  }

  // ======================
  // 🧾 TITLE
  // ======================

  const title =

    aiCorrection.confidence >=
    0.8

      ? aiCorrection.title

      : deterministicTitle

  // ======================
  // 📂 CATEGORY
  // ======================

  const categoryPath =

    aiCorrection.confidence >=
    0.8

      ? aiCorrection.categoryPath

      : []

  return {

    title,

    categoryPath,

    attributes
  }
}