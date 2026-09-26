export interface Drug {
  id: string;
  dci: string;
  brands: string[];
  // Other names the drug is searched or written under (e.g. "Aspirine" for the lysine acetylsalicylate).
  aliases?: string[];
  class?: string;
  forms: string[];
  dosage: string;
  contraindications: string[];
  warning?: string;
  notes?: string;
  source: string;
}
