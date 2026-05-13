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
    .trim()
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
  // 📚 LONGEST ALIASES FIRST
  // ======================

  const sorted =
    [...dictionary].sort(
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

  // ======================
  // 🔎 SEARCH
  // ======================

  for (const item of sorted) {

    for (const alias of item.aliases) {

      const normalizedAlias =
        normalizeValue(alias)

      if (
        normalizedText.includes(
          normalizedAlias
        )
      ) {

        return item.canonical
      }
    }
  }

  return null
}