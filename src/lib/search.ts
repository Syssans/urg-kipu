// Accent-, case- and ligature-insensitive form used everywhere in search.
// NFKD also turns subscripts/superscripts into digits ("CHA₂DS₂" → "cha2ds2", "ABCD²" → "abcd2").
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/œ/gi, "oe")
    .replace(/æ/gi, "ae")
    .toLowerCase();
}

function words(text: string): string[] {
  return normalizeSearch(text).split(/[^a-z0-9]+/).filter(Boolean);
}

export interface SearchField {
  text: string;
  weight: number;
}

// Relative importance of each kind of field.
export const W = { name: 10, keyword: 6, category: 4, summary: 3, body: 2, synonym: 2 } as const;

// Emergency-medicine abbreviations and their spelled-out forms. If an item's text contains any
// member of a group, the whole group becomes searchable for that item (so "arrêt cardiaque"
// finds a fiche that only says "ACR", and "douleur" finds an "analgésique").
const SYNONYM_GROUPS: string[][] = [
  ["acr", "arret cardiaque", "arret cardio respiratoire", "arret cardiorespiratoire"],
  ["ep", "embolie pulmonaire"],
  ["tvp", "thrombose veineuse", "phlebite"],
  ["sca", "syndrome coronarien", "infarctus", "idm"],
  ["avc", "accident vasculaire cerebral", "stroke"],
  ["ait", "accident ischemique transitoire"],
  ["oap", "oedeme pulmonaire", "oedeme aigu pulmonaire"],
  ["eme", "etat de mal", "epilepsie", "epileptique", "convulsion", "convulsions", "convulsive", "convulsif"],
  ["isr", "intubation", "sequence rapide"],
  ["tc", "traumatisme cranien"],
  ["aag", "asthme", "bronchospasme"],
  ["douleur", "antalgique", "analgesique", "analgesie", "antalgie"],
  ["anaphylaxie", "anaphylactique", "quincke", "allergique", "allergie", "urticaire"],
  ["nausees", "vomissements", "antiemetique"],
  ["sedation", "sedatif"],
  ["agitation", "agressivite"],
  ["hta", "hypertension", "hypertensif", "poussee hypertensive"],
  ["tdp", "torsade", "torsades de pointes"],
  ["bav", "bloc auriculo ventriculaire", "bradycardie"],
  ["fa", "fibrillation atriale", "acfa", "tacfa"],
  ["antidote", "intoxication", "surdosage"],
  ["hemorragie", "hemorragique", "saignement"],
  ["sepsis", "septique", "choc septique"],
  ["enfant", "pediatrie", "pediatrique", "nourrisson"],
  ["geriatrie", "personne agee", "sujet age"],
  ["hyperkaliemie", "kaliemie", "potassium"],
  ["natremie", "sodium", "hyponatremie", "hypernatremie", "dysnatremie"],
  ["calcemie", "calcium", "hypocalcemie", "hypercalcemie"],
  ["insuffisance renale", "ira", "clairance", "dfg"],
];

interface IndexedField {
  words: string[];
  whole: string;
  weight: number;
}

function synonymsFor(fields: SearchField[]): string {
  const padded = " " + fields.map((f) => words(f.text).join(" ")).join(" ") + " ";
  return SYNONYM_GROUPS.filter((group) => group.some((term) => padded.includes(` ${term} `)))
    .flat()
    .join(" ");
}

function indexFields(fields: SearchField[]): IndexedField[] {
  const indexed: IndexedField[] = fields.map((f) => {
    const w = words(f.text);
    // Names and keywords also match with punctuation removed ("crb65", "cha2ds2vasc").
    if (f.weight >= W.keyword && w.length > 1) w.push(w.join(""));
    return { words: w, whole: w.join(" "), weight: f.weight };
  });
  const syn = synonymsFor(fields);
  if (syn) indexed.push({ words: words(syn), whole: "", weight: W.synonym });
  return indexed;
}

const cache = new WeakMap<object, IndexedField[]>();

function indexed<T extends object>(item: T, fieldsOf: (item: T) => SearchField[]): IndexedField[] {
  let idx = cache.get(item);
  if (!idx) {
    idx = indexFields(fieldsOf(item));
    cache.set(item, idx);
  }
  return idx;
}

// 0 = no match. Every query word must start a word of the item; the score favours matches in
// important fields, exact words over prefixes, and a query equal to a whole name/keyword.
export function searchScore<T extends object>(item: T, query: string, fieldsOf: (item: T) => SearchField[]): number {
  const tokens = words(query);
  if (tokens.length === 0) return 0;
  const idx = indexed(item, fieldsOf);
  let total = 0;
  for (const t of tokens) {
    let best = 0;
    for (const f of idx) {
      for (const w of f.words) {
        if (w === t) best = Math.max(best, f.weight * 2);
        else if (w.startsWith(t)) best = Math.max(best, f.weight);
      }
    }
    if (best === 0) return 0;
    total += best;
  }
  const whole = tokens.join(" ");
  if (idx.some((f) => f.weight >= W.keyword && f.whole === whole)) total += 30;
  return total;
}

export function searchRanked<T extends object>(items: T[], query: string, fieldsOf: (item: T) => SearchField[]): T[] {
  if (words(query).length === 0) return items;
  return items
    .map((item, i) => ({ item, i, score: searchScore(item, query, fieldsOf) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((r) => r.item);
}
