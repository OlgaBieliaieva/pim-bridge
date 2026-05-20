import { CategoryNode } from "../types"

import {AiTaxonomyNode} from "./taxonomy-ai.types"

export function exportTaxonomyForAi(
  nodes: CategoryNode[]
): AiTaxonomyNode[] {

  return nodes.map(
    (node) => ({

      id:
        node.id,

      name:
        node.name,

      parent:
        node.parent,

      children:
        node.children?.length
          ? exportTaxonomyForAi(
              node.children
            )
          : []
    })
  )
}