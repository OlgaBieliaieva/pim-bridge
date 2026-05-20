import {CategoryNode} from "../types"

export function buildCategoryTree(
  categories: CategoryNode[]
): CategoryNode[] {

  // ======================
  // 🗂️ MAP
  // ======================

  const map =
    new Map<number, CategoryNode>()

  // ======================
  // 🌱 CREATE NODES
  // ======================

  for (const category of categories) {

    map.set(
      category.id,
      {

        id:
          category.id,

        name:
          category.name,

        slug:
          category.slug,

        parent:
          category.parent || 0,

        description:
          category.description || "",

        image:
          category.image ||
          null,

        count:
          category.count || 0,

        children: []
      }
    )
  }

  // ======================
  // 🌳 BUILD TREE
  // ======================

  const roots:
    CategoryNode[] = []

  for (
    const node of map.values()
  ) {

    // ROOT
    if (!node.parent) {

      roots.push(node)

      continue
    }

    // CHILD
    const parent =
      map.get(
        node.parent
      )

    if (parent) {

      parent.children.push(
        node
      )
    }
  }

  return roots
}