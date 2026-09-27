import type { Drug } from "./types";
import { acetylsalicylateLysine } from "./acetylsalicylate-lysine";
import { acideTranexamique } from "./acide-tranexamique";
import { adenosineTriphosphate } from "./adenosine-triphosphate";
import { adrenaline } from "./adrenaline";
import { amiodarone } from "./amiodarone";
import { amoxicillineAcideClavulanique } from "./amoxicilline-acide-clavulanique";
import { atropine } from "./atropine";
import { betamethasone } from "./betamethasone";
import { cisatracurium } from "./cisatracurium";
import { clonazepam } from "./clonazepam";
import { dexchlorpheniramine } from "./dexchlorpheniramine";
import { diazepam } from "./diazepam";
import { diltiazem } from "./diltiazem";
import { dobutamine } from "./dobutamine";
import { enoxaparine } from "./enoxaparine";
import { ephedrine } from "./ephedrine";
import { etomidate } from "./etomidate";
import { fibrinogene } from "./fibrinogene";
import { flumazenil } from "./flumazenil";
import { furosemide } from "./furosemide";
import { gluconateCalcium } from "./gluconate-calcium";
import { glucose30 } from "./glucose-30";
import { heparine } from "./heparine";
import { hydrocortisone } from "./hydrocortisone";
import { hydroxocobalamine } from "./hydroxocobalamine";
import { insulineAsparte } from "./insuline-asparte";
import { isoprenaline } from "./isoprenaline";
import { isosorbideDinitrate } from "./isosorbide-dinitrate";
import { ketamine } from "./ketamine";
import { ketoprofene } from "./ketoprofene";
import { levetiracetam } from "./levetiracetam";
import { loxapine } from "./loxapine";
import { methylprednisolone } from "./methylprednisolone";
import { metoclopramide } from "./metoclopramide";
import { midazolam } from "./midazolam";
import { morphine } from "./morphine";
import { nalbuphine } from "./nalbuphine";
import { naloxone } from "./naloxone";
import { nefopam } from "./nefopam";
import { nicardipine } from "./nicardipine";
import { nimodipine } from "./nimodipine";
import { noradrenaline } from "./noradrenaline";
import { oxytocine } from "./oxytocine";
import { paracetamol } from "./paracetamol";
import { phloroglucinol } from "./phloroglucinol";
import { prednisolone } from "./prednisolone";
import { propofol } from "./propofol";
import { salbutamol } from "./salbutamol";
import { sufentanil } from "./sufentanil";
import { sulfateMagnesium } from "./sulfate-magnesium";
import { suxamethonium } from "./suxamethonium";
import { tenecteplase } from "./tenecteplase";
import { thiopental } from "./thiopental";
import { searchRanked, W, type SearchField } from "../search";

export const drugs: Drug[] = [
  acetylsalicylateLysine,
  acideTranexamique,
  adenosineTriphosphate,
  adrenaline,
  amiodarone,
  amoxicillineAcideClavulanique,
  atropine,
  betamethasone,
  cisatracurium,
  clonazepam,
  dexchlorpheniramine,
  diazepam,
  diltiazem,
  dobutamine,
  enoxaparine,
  ephedrine,
  etomidate,
  fibrinogene,
  flumazenil,
  furosemide,
  gluconateCalcium,
  glucose30,
  heparine,
  hydrocortisone,
  hydroxocobalamine,
  insulineAsparte,
  isoprenaline,
  isosorbideDinitrate,
  ketamine,
  ketoprofene,
  levetiracetam,
  loxapine,
  methylprednisolone,
  metoclopramide,
  midazolam,
  morphine,
  nalbuphine,
  naloxone,
  nefopam,
  nicardipine,
  nimodipine,
  noradrenaline,
  oxytocine,
  paracetamol,
  phloroglucinol,
  prednisolone,
  propofol,
  salbutamol,
  sufentanil,
  sulfateMagnesium,
  suxamethonium,
  tenecteplase,
  thiopental,
];

export function getDrug(id: string): Drug | undefined {
  return drugs.find((d) => d.id === id);
}

// Dosage lines start with the indication ("Anaphylaxie adulte : ...", "ACR : ..."), so indexing
// them lets a search by indication find the drug.
export function drugSearchFields(d: Drug): SearchField[] {
  return [
    { text: d.dci, weight: W.name },
    ...d.brands.map((b) => ({ text: b, weight: W.name })),
    ...(d.aliases ?? []).map((a) => ({ text: a, weight: W.keyword })),
    { text: d.class ?? "", weight: W.category },
    { text: d.dosage, weight: W.body },
  ];
}

export function searchDrugs(query: string): Drug[] {
  return searchRanked(drugs, query, drugSearchFields);
}

export * from "./types";
