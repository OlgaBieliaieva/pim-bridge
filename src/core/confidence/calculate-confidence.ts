type ConfidenceInput = {

  title?: string

  categoryPath?: string[]

  brand?: string | null

  country?: string | null

  material?: string | null

  color?: string | null

  model?: string | null

  weight?: number | null

  volume?: number | null

  barcode?: string | null

  dimensions?: {
    width?: number
    height?: number
    length?: number
  } | null

  diameter?: number | null

  height?: number | null
}

export function calculateConfidence(
  data: ConfidenceInput
) {

  let score = 0

  const reasons: string[] = []

  // ======================
  // 🧾 TITLE
  // ======================

  if (
    data.title &&
    data.title.length > 2
  ) {

    score += 0.2

    reasons.push(
      "title_present"
    )
  }

  // ======================
  // 📂 CATEGORY
  // ======================

  if (
    data.categoryPath &&
    data.categoryPath.length > 0
  ) {

    score += 0.2

    reasons.push(
      "category_present"
    )
  }

  // ======================
  // 🏷️ BRAND
  // ======================

  if (data.brand) {

    score += 0.15

    reasons.push(
      "brand_detected"
    )
  }

  // ======================
  // 🌍 COUNTRY
  // ======================

  if (data.country) {

    score += 0.05

    reasons.push(
      "country_detected"
    )
  }

  // ======================
  // 🧱 MATERIAL
  // ======================

  if (data.material) {

    score += 0.05

    reasons.push(
      "material_detected"
    )
  }

// ======================
// 🎨 COLOR
// ======================

if (data.color) {

  score += 0.1

  reasons.push(
    "color_detected"
  )
}

  // ======================
  // ⚖️ WEIGHT
  // ======================

  if (data.weight) {

    score += 0.1

    reasons.push(
      "weight_detected"
    )
  }

  // ======================
  // 🧴 VOLUME
  // ======================

  if (data.volume) {

    score += 0.1

    reasons.push(
      "volume_detected"
    )
  }

  // ======================
  // 📏 DIMENSIONS
  // ======================

  if (data.dimensions) {

    score += 0.1

    reasons.push(
      "dimensions_detected"
    )
  }

  // ======================
// ⭕ DIAMETER
// ======================

if (data.diameter) {

  score += 0.1

  reasons.push(
    "diameter_detected"
  )
}

// ======================
// 📐 HEIGHT
// ======================

if (data.height) {

  score += 0.05

  reasons.push(
    "height_detected"
  )
}
  
  // ======================
  // 🔢 MODEL
  // ======================

  if (data.model) {

    score += 0.1

    reasons.push(
      "model_detected"
    )
  }

  // ======================
  // 📦 BARCODE
  // ======================

  if (data.barcode) {

    score += 0.1

    reasons.push(
      "barcode_detected"
    )
  }

  // ======================
  // 🧹 PENALTIES
  // ======================

  if (
    data.title?.includes('"')
  ) {

    score -= 0.1

    reasons.push(
      "dirty_quotes"
    )
  }

  if (
    data.title?.includes(" .")
  ) {

    score -= 0.1

    reasons.push(
      "dirty_punctuation"
    )
  }

  if (
    data.title &&
    data.title.length < 4
  ) {

    score -= 0.2

    reasons.push(
      "title_too_short"
    )
  }

  // ======================
  // 🛡️ LIMITS
  // ======================

  if (score < 0) {
    score = 0
  }

  if (score > 1) {
    score = 1
  }

  return {

    score:
      Number(
        score.toFixed(2)
      ),

    reasons
  }
}