// Strips accents/diacritics so search matches regardless of whether the user
// types them (e.g. "leveti" or "genve" both match "Lévétiracétam"/"Genève").
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}
