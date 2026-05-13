export function cleanQuotes(text: string = "") {
  return text
    .replace(/&quot;/g, "")
    .replace(/"/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function stripHtml(html: string = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function capitalize(text: string) {
  if (!text) return text

  return text.charAt(0).toUpperCase() +
    text.slice(1)
}