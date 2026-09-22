export interface Drug {
  id: string;
  dci: string;
  brands: string[];
  class?: string;
  forms: string[];
  dosage: string;
  contraindications: string[];
  warning?: string;
  notes?: string;
  source: string;
}
