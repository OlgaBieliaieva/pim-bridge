export type ProcessingStep = {
  step: string

  timestamp: string

  success: boolean

  payload?: any

  error?: any
}

export type ProcessingLog = {
  productId: string

  source: string

  startedAt: string

  finishedAt?: string

  status: "success" | "failed"

  steps: ProcessingStep[]
}