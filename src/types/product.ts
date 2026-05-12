import { z } from "zod"

export const ProductSchema = z.object({
  title: z.string(),
  price: z.string()
})

export type RawProduct = {
  external_id: string
  available: boolean
  sku: string
  name: string
  price: string
  description: string
  size?: string
  stock: number
  goodTypeFull?: string
  barcode?: string
}

export type WooProductPayload = {
  name: string
  type: "simple"
  regular_price: string
  description: string
  manage_stock: boolean
  stock_quantity: number
  sku: string
  attributes?: any[]
}
