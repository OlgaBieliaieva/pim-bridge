import {
  ProductAttributes,
  ProvenanceAttribute
} from "../../types/normalized-product"

import {
  AiCorrectionResult
} from "./ai.types"

function mergeAttribute<T>(

  deterministic?:
    ProvenanceAttribute<T>,

  ai?:
    ProvenanceAttribute<T>

): ProvenanceAttribute<T> | undefined {

  // ======================
  // NO AI
  // ======================

  if (!ai) {
    return deterministic
  }

  // ======================
  // NO DETERMINISTIC
  // ======================

  if (!deterministic) {
    return ai
  }

  // ======================
  // DICTIONARY ALWAYS WINS
  // ======================

  if (
    deterministic.source ===
    "dictionary"
  ) {

    return deterministic
  }

  // ======================
  // AI beats weak regex
  // ======================

  if (

    deterministic.source ===
      "regex" &&

    deterministic.confidence <
      ai.confidence
  ) {

    return ai
  }

  return deterministic
}

export function mergeAiRefinement(

  deterministic:
    ProductAttributes,

  ai:
    ProductAttributes

): ProductAttributes {

  return {

    brand:
      mergeAttribute(
        deterministic.brand,
        ai.brand
      ),

    country:
      mergeAttribute(
        deterministic.country,
        ai.country
      ),

    material:
      mergeAttribute(
        deterministic.material,
        ai.material
      ),

    color:
      mergeAttribute(
        deterministic.color,
        ai.color
      ),

    model:
      mergeAttribute(
        deterministic.model,
        ai.model
      ),

    weight:
      mergeAttribute(
        deterministic.weight,
        ai.weight
      ),

    volume:
      mergeAttribute(
        deterministic.volume,
        ai.volume
      ),

    dimensions:
      mergeAttribute(
        deterministic.dimensions,
        ai.dimensions
      ),

    diameter:
      mergeAttribute(
        deterministic.diameter,
        ai.diameter
      ),

    height:
      mergeAttribute(
        deterministic.height,
        ai.height
      )
  }
}