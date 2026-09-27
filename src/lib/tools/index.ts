import type { Calculator } from "../calculators/types";
import { searchRanked } from "../search";
import { calculatorSearchFields } from "../calculators";
import { glycemiaConversion } from "./glycemiaConversion";
import { qtc } from "./qtc";
import { bmi } from "./bmi";
import { creatinineClearance } from "./creatinineClearance";
import { correctedSodium } from "./correctedSodium";
import { waterDeficit } from "./waterDeficit";
import { correctedCalcium } from "./correctedCalcium";

export const tools: Calculator[] = [glycemiaConversion, qtc, bmi, creatinineClearance, correctedSodium, waterDeficit, correctedCalcium];

export function getTool(id: string): Calculator | undefined {
  return tools.find((t) => t.id === id);
}

export function searchTools(query: string): Calculator[] {
  return searchRanked(tools, query, calculatorSearchFields);
}
