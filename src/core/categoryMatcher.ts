type MatchResult = {
  path: string[]
}

export function matchCategory(product: any): MatchResult {
  const type = (product.goodTypeFull || "").toLowerCase()
  const name = (product.name || "").toLowerCase()

  // 🔹 Кондитерка → спеції
  if (type.includes("прянощ") || name.includes("кардамон") || name.includes("аніс")) {
    return { path: ["Кондитерка", "Інгредієнти", "Спеції"] }
  }

  // 🔹 Кондитерка → інгредієнти
  if (type.includes("продукти харчування")) {
    return { path: ["Кондитерка", "Інгредієнти"] }
  }

  // 🔹 Дріжджі
  if (name.includes("дріждж")) {
    return { path: ["Кондитерка", "Інгредієнти", "Дріжджі"] }
  }

  // 🔹 Розпилювач
  if (type.includes("розпилювач")) {
    return { path: ["Кухня", "Аксесуари", "Розпилювачі"] }
  }

  // fallback
  return { path: ["Інше"] }
}