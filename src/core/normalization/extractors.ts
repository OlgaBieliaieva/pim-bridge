import { COUNTRIES } from "../../dictionaries/countries"

import { MATERIALS } from "../../dictionaries/materials"

import {COLORS} from "../../dictionaries/colors"

import { BRANDS } from "../../dictionaries/brands"

import { findInDictionary } from "./find-in-dictionary"

import { capitalize } from "../../utils/text"

// ======================
// 🧹 CLEAN TEXT
// ======================

export function cleanText(
  text: string
): string {

  return text
    .replace(/&quot;/g, "")
    .replace(/"/g, "")
    .replace(/[|]+/g, " ")
    .replace(/\s+\./g, ".")
    .replace(/\.+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

// ======================
// 🌍 COUNTRY
// ======================

export function extractCountry(
  text: string
): string | null {

  return findInDictionary(
    text,
    COUNTRIES
  )
}

// ======================
// 🧱 MATERIAL
// ======================

export function extractMaterial(
  text: string
): string | null {

  return findInDictionary(
    text,
    MATERIALS
  )
}

// ======================
// 🎨 COLOR
// ======================

export function extractColor(
  text: string
): string | null {

  return findInDictionary(
    text,
    COLORS
  )
}

// ======================
// ⚖️ WEIGHT
// ======================

export function extractWeight(
  text: string
): number | null {

  const match = text.match(
    /(\d+(?:[.,]\d+)?)\s?(г|гр|кг)(?![а-яіїєa-z])/iu
  )

  if (!match) {
    return null
  }

  let value = Number(
    match[1].replace(",", ".")
  )

  const unit =
    match[2].toLowerCase()

  if (unit === "кг") {
    value *= 1000
  }

  return value
}

// ======================
// 🧴 VOLUME
// ======================

export function extractVolume(
  text: string
): number | null {

  const match = text.match(
    /(\d+(?:[.,]\d+)?)\s?(мл|л)(?![а-яіїєa-z])/iu
  )

  if (!match) {
    return null
  }

  let value = Number(
    match[1].replace(",", ".")
  )

  const unit =
    match[2].toLowerCase()

  if (unit === "л") {
    value *= 1000
  }

  return value
}

// ======================
// 📏 DIMENSIONS
// ======================

export function extractDimensions(
  text: string
) {

  // ======================
  // 📦 3D
  // 10*10*12,5см
  // (10x10x12см)
  // ======================

  const match3d = text.match(
    /\(?\s?(\d+(?:[.,]\d+)?)\s?[xх*]\s?(\d+(?:[.,]\d+)?)\s?[xх*]\s?(\d+(?:[.,]\d+)?)\s?(см|мм|mm)?\s?\)?/iu
  )

  if (match3d) {

    return {
      width: Number(
        match3d[1].replace(",", ".")
      ),

      height: Number(
        match3d[2].replace(",", ".")
      ),

      length: Number(
        match3d[3].replace(",", ".")
      ),

      unit: match3d[4] || null
    }
  }

  // ======================
  // 📏 2D
  // 30*20см
  // (3,8*4,3см)
  // ======================

  const match2d = text.match(
    /\(?\s?(\d+(?:[.,]\d+)?)\s?[xх*]\s?(\d+(?:[.,]\d+)?)\s?(см|мм|mm)?\s?\)?/iu
  )

  if (match2d) {

    return {
      width: Number(
        match2d[1].replace(",", ".")
      ),

      height: Number(
        match2d[2].replace(",", ".")
      ),

      unit: match2d[3] || null
    }
  }

  return null
}

export function extractDiameter(
  text: string
): number | null {

  const patterns = [

    // д.210мм
    /д\.\s?(\d+(?:[.,]\d+)?)\s?мм/iu,

    // d210мм
    /d\s?(\d+(?:[.,]\d+)?)\s?мм/iu,

    // Ø210мм
    /ø\s?(\d+(?:[.,]\d+)?)\s?мм/iu,

    // діаметр 210мм
    /діаметр\s?(\d+(?:[.,]\d+)?)\s?мм/iu
  ]

  for (const pattern of patterns) {

    const match = text.match(pattern)

    if (match) {

      return Number(
        match[1].replace(",", ".")
      )
    }
  }

  return null
}

export function extractHeight(
  text: string
): number | null {

  const patterns = [

    // h-100мм
    /h[-\s]?(\d+(?:[.,]\d+)?)\s?мм/iu,

    // висота 100мм
    /висота\s?(\d+(?:[.,]\d+)?)\s?мм/iu
  ]

  for (const pattern of patterns) {

    const match = text.match(pattern)

    if (match) {

      return Number(
        match[1].replace(",", ".")
      )
    }
  }

  return null
}

// ======================
// 🔢 MODEL
// ======================

export function extractModel(
  text: string
): string | null {

  const patterns = [

  // R99461 / ABC123
  /\b[A-ZА-Я]{1,5}\d{2,}[A-Z0-9-]*\b/u,

  // ZN-2918 / R10001-S
  /\b[A-Z0-9]+(?:-[A-Z0-9]+)+\b/u,

  /\b[A-ZА-ЯІЇЄ]{1,5}[-]?[A-ZА-Я0-9]{2,}(?:-[A-Z0-9А-Я]+)*\b/iu
]

  for (const pattern of patterns) {

    const match =
      text.match(pattern)

    if (match?.length) {
      return match[0]
    }
  }

  return null
}

// ======================
// 🏷️ BARCODE
// ======================

export function extractBarcode(
  attributes: any[]
): string | null {

  const barcodeAttr =
    attributes.find(
      (a) =>
        a.name?.toLowerCase() ===
        "штрихкод"
    )

  if (!barcodeAttr) {
    return null
  }

  return barcodeAttr.options?.[0]
    ?.replace(/"/g, "")
    ?.trim() || null
}

// ======================
// 🏭 BRAND
// ======================

export function extractBrand(
  title: string,
  country: string | null,
  model: string | null
): string | null {

  // ======================
  // 📚 DICTIONARY FIRST
  // ======================

  const dictionaryBrand =
    findInDictionary(
      title,
      BRANDS
    )

  if (dictionaryBrand) {
    return dictionaryBrand
  }

  // ======================
  // 🧹 CLEAN
  // ======================

  let cleaned = title

  if (country) {

    cleaned = cleaned.replace(
      new RegExp(country, "ig"),
      ""
    )
  }

  if (model) {

    cleaned = cleaned.replace(
      new RegExp(
        model.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        ),
        "ig"
      ),
      ""
    )
  }

  const words =
    cleaned.split(" ")

  // ======================
  // 🔠 ALL CAPS
  // ======================

  const upper =
    words.find(
      (w) =>
        /^[A-Z]{3,}$/.test(w)
    )

  if (upper) {
    return capitalize(
      upper.toLowerCase()
    )
  }

  // ======================
  // 🔤 LAST WORD
  // ======================

  const last =
    words[words.length - 1]

  if (
    last &&
    last.length > 2 &&
    !/\d/.test(last)
  ) {

    return capitalize(last)
  }

  return null
}

// ======================
// ✂️ REMOVE EXTRACTED
// ======================

export function removeExtractedData(
  text: string,
  values: (string | null)[]
): string {

  let result = text

  for (const value of values) {

    if (!value) {
      continue
    }

    const escaped =
      value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )

    result = result.replace(
      new RegExp(escaped, "ig"),
      ""
    )
  }

  return cleanText(result)
}