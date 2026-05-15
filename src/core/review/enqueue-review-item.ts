import fs from "fs/promises"

import path from "path"

import {
  ReviewQueueItem
} from "./review.types"

const FILE =
  path.join(
    process.cwd(),
    "data",
    "review-queue",
    "pending.json"
  )

export async function enqueueReviewItem(
  item: ReviewQueueItem
) {

  try {

    // ======================
    // 📖 READ
    // ======================

    const raw =
      await fs.readFile(
        FILE,
        "utf-8"
      )

    const items:
      ReviewQueueItem[] =
        JSON.parse(raw)

    // ======================
    // 🚫 DUPLICATES
    // ======================

    const exists =
      items.find(
        (i) =>
          i.productId ===
          item.productId
      )

    if (exists) {
      return
    }

    // ======================
    // ➕ PUSH
    // ======================

    items.push(item)

    // ======================
    // 💾 SAVE
    // ======================

    await fs.writeFile(
      FILE,
      JSON.stringify(
        items,
        null,
        2
      ),
      "utf-8"
    )

  } catch (e) {

    console.error(
      "enqueueReviewItem error",
      e
    )
  }
}