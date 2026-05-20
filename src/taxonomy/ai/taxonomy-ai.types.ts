export type AiTaxonomyNode = {

  id: number

  name: string

  parent: number

  children?: AiTaxonomyNode[]
}

// ======================
// ✨ RENAME
// ======================

export type CategoryRenameProposal = {

  id: number

  oldName: string

  newName: string

  reason: string
}

// ======================
// 🔀 MOVE
// ======================

export type CategoryMoveProposal = {

  id: number

  oldParent: number

  newParent: number

  reason: string
}

// ======================
// 🔗 MERGE
// ======================

export type CategoryMergeProposal = {

  sourceIds: number[]

  targetId: number

  reason: string
}

// ======================
// 🤖 AI RESULT
// ======================

export type TaxonomyOptimizationProposal = {

  renames:
    CategoryRenameProposal[]

  moves:
    CategoryMoveProposal[]

  merges:
    CategoryMergeProposal[]

  warnings?: string[]
}