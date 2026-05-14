export type AiRefinementInput = {

  rawTitle: string

  normalizedTitle: string

  normalizedDescription?: string

  categoryPath: string[]

  attributes: {

    brand?: string | null

    country?: string | null

    material?: string | null

    color?: string | null

    model?: string | null

    weight?: number | null

    volume?: number | null

    diameter?: number | null

    height?: number | null
  }
}

export type AiRefinementResult = {

  title: string

  shortDescription?: string

  description?: string

  categoryPath: string[]

  attributes: {

    brand?: string | null

    country?: string | null

    material?: string | null

    color?: string | null

    model?: string | null

    weight?: number | null

    volume?: number | null

    diameter?: number | null

    height?: number | null
  }

  seoTitle?: string

  seoDescription?: string

  confidence: number
}