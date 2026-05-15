import {
  ProvenanceAttribute
} from "../../../types/normalized-product"

export function mergeAttribute<T>(

  deterministic?:
    ProvenanceAttribute<T>,

  ai?:
    ProvenanceAttribute<T>

): ProvenanceAttribute<T> | undefined {

  // ======================
  // 🚫 NOTHING
  // ======================

  if (
    !deterministic &&
    !ai
  ) {

    return undefined
  }

  // ======================
  // ✅ ONLY DETERMINISTIC
  // ======================

  if (
    deterministic &&
    !ai
  ) {

    return deterministic
  }

  // ======================
  // 🤖 ONLY AI
  // ======================

  if (
    !deterministic &&
    ai
  ) {

    return {

      ...ai,

      requiresReview:
        true
    }
  }

  // ======================
  // 🟢 TRUSTED DICTIONARY
  // ======================

  if (
    deterministic?.source ===
      "dictionary" &&
    deterministic.confidence >=
      0.95
  ) {

    return deterministic
  }

  // ======================
  // 🟡 AI HIGHER CONFIDENCE
  // ======================

  if (
    ai &&
    deterministic &&
    ai.confidence >
      deterministic.confidence
  ) {

    return {

      ...ai,

      requiresReview:
        ai.confidence < 0.95
    }
  }

  // ======================
  // 🔵 KEEP DETERMINISTIC
  // ======================

  return deterministic
}