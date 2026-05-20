export type WooCategory = {

  id: number

  name: string

  slug: string

  parent: number

  description?: string

  image?: {

    src?: string
  } | null

  count?: number
}

export type CategoryImage = {

  id: number

  date_created?: string

  date_created_gmt?: string

  date_modified?: string

  date_modified_gmt?: string

  src: string

  name?: string

  alt?: string | null
}

// ======================
// 🌳 CATEGORY NODE
// ======================

export type CategoryNode = {

  // Woo ID
  id: number

  // Raw Woo parent
  parent: number

  // Visible name
  name: string

  // URL slug
  slug: string

  // Optional description
  description?: string

  // Optional image
  image?: CategoryImage | null

  // Product count
  count?: number

  // Tree
  children: CategoryNode[]
}

export type OptimizedCategoryNode =
  CategoryNode & {

    seoTitle?: string

    seoDescription?: string

    keywords?: string[]

    level?: number

    canonicalPath?: string[]

    isLeaf?: boolean

    productTypes?: string[]
  }

  export type TaxonomyChunk = {

  rootId: number

  rootName: string

  nodes: CategoryNode[]
}