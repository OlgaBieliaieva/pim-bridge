import axios from "axios"
import fs from "fs/promises"
import path from "path"

const API =
  process.env.PRYDANE_API_URL + "/products/categories"

const PER_PAGE = 100

export async function fetchWooCategories(
  startPage = 1,
  endPage = startPage
) {
  // 🔹 run id для конкретного snapshot batch
  const runId = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")

  // 🔹 структура директорій
  const baseDir = path.join(
    process.cwd(),
    "data",
    "prydane",
    "categories"
  )

  const rawDir = path.join(
    baseDir,
    "raw",
    runId
  )

  const snapshotsDir = path.join(
    baseDir,
    "snapshots"
  )

  const normalizedDir = path.join(
    baseDir,
    "normalized"
  )

  const cacheDir = path.join(
    baseDir,
    "cache"
  )

  // 🔹 створення директорій
  await fs.mkdir(rawDir, { recursive: true })
  await fs.mkdir(snapshotsDir, { recursive: true })
  await fs.mkdir(normalizedDir, { recursive: true })
  await fs.mkdir(cacheDir, { recursive: true })

  let totalCategories = 0
  const processedPages: number[] = []

  // 🔹 цикл по сторінках
  for (let page = startPage; page <= endPage; page++) {
    console.log(`📥 Fetching page ${page}`)

    const response = await axios.get(API, {
      params: {
        consumer_key:
          process.env.PRYDANE_CONSUMER_KEY,

        consumer_secret:
          process.env.PRYDANE_CONSUMER_SECRET,

        per_page: PER_PAGE,

        page
      }
    })

    const categories = response.data

    // 🔹 якщо сторінка пуста
    if (!categories.length) {
      console.log(`✅ Page ${page} is empty`)
      break
    }

    // 🔹 файл сторінки
    const filePath = path.join(
      rawDir,
      `categories_p_${page}.json`
    )

    // 🔹 save raw snapshot
    await fs.writeFile(
      filePath,
      JSON.stringify(categories, null, 2),
      "utf-8"
    )

    processedPages.push(page)

    totalCategories += categories.length

    console.log(
      `💾 Saved page ${page} (${categories.length} categories)`
    )

    // 🔹 pause
    await new Promise((r) => setTimeout(r, 300))
  }

  // 🔹 manifest
  const manifest = {
    runId,

    source: "prydane-woocommerce",

    createdAt: new Date().toISOString(),

    pages: processedPages,

    totalCategories,

    perPage: PER_PAGE
  }

  // 🔹 save manifest
  await fs.writeFile(
    path.join(rawDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  )

  console.log(
    `✅ Fetch completed (${totalCategories} categories)`
  )

  return manifest
}