export function normalizeCategoryName(
  name: string
): string {

  return name

    // ======================
    // remove Woo prefixes
    // ======================

    .replace(
      /^[-–—]+\s*/u,
      ""
    )

    // ======================
    // normalize spaces
    // ======================

    .replace(/\s+/g, " ")

    // ======================
    // remove trailing dots
    // ======================

    .replace(/\.+$/g, "")

    // ======================
    // trim
    // ======================

    .trim()

    // ======================
    // capitalize first letter
    // ======================

    .replace(
      /^./u,
      (s) =>
        s.toUpperCase()
    )
}