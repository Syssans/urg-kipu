import { linkifyDrugs } from "../lib/drugs/linkify";

export function DrugText({ text, excludeDrugId }: { text: string; excludeDrugId?: string }) {
  return <>{linkifyDrugs(text, excludeDrugId)}</>;
}
