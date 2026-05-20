import {askOpenRouter} from "../../integrations/ai/providers/openrouter.provider"

import {cleanAiJson} from "../../integrations/ai/clean-ai-json"

import {AiTaxonomyNode, TaxonomyOptimizationProposal} from "./taxonomy-ai.types"

import {buildTaxonomyAiPrompt} from "./build-taxonomy-ai-prompt"

export async function optimizeTaxonomyWithAi(
  tree: AiTaxonomyNode[]
): Promise<TaxonomyOptimizationProposal> {

  const prompt =
    buildTaxonomyAiPrompt(
      tree
    )

  const response =
    await askOpenRouter(
      prompt
    )

  const cleaned =
    cleanAiJson(
      response
    )

  return JSON.parse(
    cleaned
  )
}