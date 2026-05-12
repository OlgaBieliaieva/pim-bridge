import fs from "fs"
import { RawProduct } from "../types/product"

const xml2js = require("xml2js");

export async function parseXML(filePath: string): Promise<RawProduct[]> {
  const xml = fs.readFileSync(filePath, "utf-8")
  const result = await xml2js.parseStringPromise(xml)

  const offers = result.yml_catalog.shop[0].offers[0].offer || []

  return offers.map((offer: any): RawProduct => {
    const params: Record<string, string> = {}

    if (offer.param) {
      offer.param.forEach((p: any) => {
        params[p.$.name.toLowerCase()] = p._
      })
    }

    return {
      external_id: offer.$.id,
      available: offer.available?.[0] === "true",
  sku: params.goodid || offer.vendorCode?.[0] || "",

  name: clean(params.goodname),

  price: params.retailprice || "0",

  description: clean(params.description),

  size: params.thesize,

  stock: Number(params.warehousequantity) || 0,

  goodTypeFull: clean(params.goodtypefull),

  barcode: params.barcode || ""
    }
  })
}

function clean(val: string = "") {
  return val
    .replace(/&quot;/g, "")
    .replace(/"/g, "")
    .replace(/\s+/g, " ")
    .trim()
}