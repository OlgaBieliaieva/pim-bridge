import { normalizeProduct } from "./normalize"
import { matchCategory } from "./categoryMatcher"
import { syncProduct } from "../integrations/woocommerce.products"

export async function processProduct(raw: any) {
  const normalized = normalizeProduct(raw)

  const category = matchCategory(normalized)

  console.log("📦", normalized.name, "→", category.path)

  await syncProduct(normalized, category.path)
}