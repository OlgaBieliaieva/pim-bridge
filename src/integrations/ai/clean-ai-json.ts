export function cleanAiJson(
  text: string
): string {

  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim()
}