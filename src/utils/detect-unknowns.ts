import { logUnknownToken } from "../core/normalization/log-unknown-token"

export async function detectUnknowns(
  title: string,
  data: {
    brand?: string | null
    country?: string | null
    material?: string | null
  }
) {

  const words =
    title.split(" ")

  // possible brands

  if (!data.brand) {

    const upper =
      words.filter(
        (w) =>
          /^[A-Z]{3,}$/.test(w)
      )

    for (const token of upper) {

      await logUnknownToken(
        token,
        "possible_brand"
      )
    }
  }

  // possible countries

  if (
    !data.country &&
    title.toLowerCase().includes("турція")
  ) {
    await logUnknownToken(
      "турція",
      "country"
    )
  }
}