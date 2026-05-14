type DictionaryEntry = {
  canonical: string
  aliases: string[]
}

// ======================
// 🧹 NORMALIZE VALUE
// ======================

function normalizeValue(
  value: string
): string {

  return value
    .toLowerCase()
    .replace(/[’']/g, "")
    .trim()
}

// ======================
// 🔐 ESCAPE REGEX
// ======================

function escapeRegex(
  value: string
): string {

  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  )
}

// ======================
// 🪓 TOKENIZE
// ======================

function tokenize(
  text: string
): string[] {

  return (
    text.match(
      /[a-zа-яіїє0-9-]+/giu
    ) || []
  )
}

// ======================
// 📚 SORT DICTIONARY
// ======================

export function sortDictionary(
  dictionary: DictionaryEntry[]
): DictionaryEntry[] {

  return [...dictionary].sort(
    (a, b) => {

      const aMax =
        Math.max(
          ...a.aliases.map(
            (x) => x.length
          )
        )

      const bMax =
        Math.max(
          ...b.aliases.map(
            (x) => x.length
          )
        )

      return bMax - aMax
    }
  )
}

// ======================
// 🔍 FIND IN DICTIONARY
// ======================

export function findInDictionary(
  text: string,
  dictionary: DictionaryEntry[]
): string | null {

  const normalizedText =
    normalizeValue(text)

  // ======================
  // 🪓 TOKEN SET
  // ======================

  const tokenSet =
    new Set(
      tokenize(normalizedText)
    )

  // ======================
  // 🔎 SEARCH
  // ======================

  for (const item of dictionary) {

    for (const alias of item.aliases) {

      const normalizedAlias =
        normalizeValue(alias)

      // ======================
      // 🧩 MULTI-WORD ALIAS
      // ======================

      if (
        normalizedAlias.includes(" ")
      ) {

        const escaped =
          escapeRegex(
            normalizedAlias
          )

        const pattern =
          new RegExp(
            `(^|\\s|[()\\[\\],.-])${escaped}(?=$|\\s|[()\\[\\],.-])`,
            "iu"
          )

        if (
          pattern.test(
            normalizedText
          )
        ) {

          return item.canonical
        }

        continue
      }

      // ======================
      // 🪙 SINGLE TOKEN
      // ======================

      if (
        tokenSet.has(
          normalizedAlias
        )
      ) {

        return item.canonical
      }
    }
  }

  return null
}

// type DictionaryEntry = {

//   canonical: string

//   aliases: string[]
// }

// // ======================
// // 🧹 NORMALIZE VALUE
// // ======================

// function normalizeValue(
//   value: string
// ): string {

//   return value
//     .toLowerCase()
//     .trim()
// }

// // ======================
// // 🔍 FIND IN DICTIONARY
// // ======================

// export function findInDictionary(
//   text: string,
//   dictionary: DictionaryEntry[]
// ): string | null {

//   const normalizedText =
//     normalizeValue(text)

//   // ======================
//   // 📚 LONGEST ALIASES FIRST
//   // ======================

//   const sorted =
//     [...dictionary].sort(
//       (a, b) => {

//         const aMax =
//           Math.max(
//             ...a.aliases.map(
//               (x) => x.length
//             )
//           )

//         const bMax =
//           Math.max(
//             ...b.aliases.map(
//               (x) => x.length
//             )
//           )

//         return bMax - aMax
//       }
//     )

//   // ======================
//   // 🔎 SEARCH
//   // ======================

//   for (const item of sorted) {

//     for (const alias of item.aliases) {

//       const normalizedAlias =
//         normalizeValue(alias)

//       if (
//         normalizedText.includes(
//           normalizedAlias
//         )
//       ) {

//         return item.canonical
//       }
//     }
//   }

//   return null
// }