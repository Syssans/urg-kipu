import { linkifyDrugs } from "../lib/drugs/linkify";

export function DrugText({ text }: { text: string }) {
  return <>{linkifyDrugs(text)}</>;
}
