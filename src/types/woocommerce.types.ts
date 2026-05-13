export type WooProductAttribute = {
  id: number

  name: string

  slug: string

  visible: boolean

  variation: boolean

  options: string[]
}

export type WooProductCategory = {
  id: number

  name: string

  slug: string
}

export type WooProductImage = {
  id: number

  src: string

  alt?: string
}

export type WooMetaData = {
  id: number

  key: string

  value: any
}

export type WooProduct = {
  id: number

  name: string

  slug: string

  permalink: string

  description: string

  short_description: string

  sku: string

  price: string

  regular_price: string

  stock_quantity: number | null

  stock_status: string

  status: string

  manage_stock: boolean

  categories: WooProductCategory[]

  attributes: WooProductAttribute[]

  images: WooProductImage[]

  meta_data: WooMetaData[]

  date_created: string

  date_modified: string
}