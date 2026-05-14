import { BRANDS } from "./brands"
import { COLORS } from "./colors"
import { COUNTRIES } from "./countries"
import { MATERIALS } from "./materials"

import {
  sortDictionary
} from "../core/normalization/find-in-dictionary"

export const SORTED_BRANDS =
  sortDictionary(BRANDS)

export const SORTED_COLORS =
  sortDictionary(COLORS)

export const SORTED_COUNTRIES =
  sortDictionary(COUNTRIES)

export const SORTED_MATERIALS =
  sortDictionary(MATERIALS)