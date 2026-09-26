export interface Drug {
  id: string;
  dci: string;
  brands: string[];
  // Other names the drug is searched or written under (e.g. "Aspirine" for the lysine acetylsalicylate).
  aliases?: string[];
  class?: string;
  forms: string[];
  // One line per bullet (\n-separated). Text wrapped in _underscores_ is dilution/preparation
  // info and is rendered in grey italics on the fiche.
  dosage: string;
  contraindications: string[];
  warning?: string;
  notes?: string;
  source: string;
}
