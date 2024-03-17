export function multilineTextToParagraph(text: string) {
  return text.replace(/[\s]+/g, ' ').trim();
}
