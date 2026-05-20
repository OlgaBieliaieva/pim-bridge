import { CategoryNode } from "../types"
import { normalizeCategoryName } from "./normalize-category-name"

export function normalizeCategoryTree(
  nodes: CategoryNode[]
): CategoryNode[] {

  return nodes.map(
    (node) => ({

      ...node,

      name:
        normalizeCategoryName(
          node.name
        ),

      children:
        node.children?.length
          ? normalizeCategoryTree(
              node.children
            )
          : []
    })
  )
}
