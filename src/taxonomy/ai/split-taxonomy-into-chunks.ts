import { CategoryNode, TaxonomyChunk } from "../types"



export function splitTaxonomyIntoChunks(
  tree: CategoryNode[]
): TaxonomyChunk[] {

  return tree.map(
    (root) => ({

      rootId:
        root.id,

      rootName:
        root.name,

      nodes: [root]
    })
  )
}