import type { DecisionTree } from "./types";

export const seizure: DecisionTree = {
  id: "convulsions",
  name: "Crise convulsive et état de mal épileptique (adulte)",
  shortName: "Convulsions (adulte)",
  summary:
    "Diagnostic et prise en charge chronométrée d'une crise convulsive tonico-clonique généralisée et de l'état de mal épileptique chez l'adulte.",
  rootId: "duree-crise",
  nodes: {
    "duree-crise": {
      type: "question",
      id: "duree-crise",
      title: "Durée de la crise / récupération de conscience ?",
      subtitle: "Premiers gestes : sécurité, PLS après la phase motrice, paramètres vitaux + glycémie capillaire, VVP (NaCl 0,9 %).",
      warning:
        "Évoquer une crise non épileptique psychogène devant des mouvements désordonnés, une hyperventilation sans cyanose, des yeux fermés avec résistance à l'ouverture, un réveil rapide sans confusion — sans pour autant retarder la prise en charge d'un réel EMETCG en cas de doute.",
      options: [
        { label: "Crise unique < 5 min, avec reprise de conscience (réponse aux ordres simples)", next: "leaf-crise-isolee" },
        { label: "Persistance > 5 min, ou récidive sans reprise de conscience entre les crises", next: "emetcg-ligne1" },
      ],
    },
    "leaf-crise-isolee": {
      type: "leaf",
      id: "leaf-crise-isolee",
      title: "Crise isolée < 5 min, reprise de conscience : pas d'EMETCG",
      items: [
        "Pas de traitement antiépileptique de première intention nécessaire si la crise reste unique et brève.",
        "Rechercher et corriger une cause immédiatement curable (hypoglycémie en priorité).",
        "Patient épileptique connu : rechercher un facteur favorisant (inobservance, sevrage alcool/benzodiazépine, privation de sommeil, infection, médicament pro-épileptogène).",
        "Patient non épileptique connu : bilan étiologique large, imagerie cérébrale au moindre doute de cause structurelle (AVC, traumatisme, infection, tumeur).",
      ],
      detail:
        "Diagnostics différentiels à évoquer : crise non épileptique psychogène, syncope convulsivante (pas de confusion postcritique, quelques secousses seulement), hypoglycémie.",
      warning: "La récidive d'une crise, même brève, doit motiver l'injection d'une benzodiazépine : le patient est alors à risque de développer un EMETCG.",
    },
    "emetcg-ligne1": {
      type: "question",
      id: "emetcg-ligne1",
      title: "EMETCG confirmé — Actions immédiates (< 5 min)",
      subtitle: "Benzodiazépine de 1ʳᵉ ligne + bilan + 2 VVP",
      detail:
        "• Clonazépam 0,015 mg/kg IVD (≈ 1 mg pour 70 kg) — ou midazolam 0,15 mg/kg IM (≈ 10 mg pour 70 kg) si pas de voie veineuse rapidement disponible.\n" +
        "• 2 VVP, dont une réservée exclusivement aux antiépileptiques ; NaCl 0,9 % (sérum glucosé réservé à une hypoglycémie confirmée).\n" +
        "• Oxygénothérapie systématique, scope.\n" +
        "• Bilan biologique : GDS + lactates, NFS, glycémie, ionogramme + calcémie ionisée + magnésémie, bilan hépatique, CPK, dosage des antiépileptiques si traitement au long cours, β-hCG si femme en âge de procréer.\n" +
        "• Recherche et correction immédiate d'une hypoglycémie (glucosé 30 %).",
      warning:
        "Ne pas intuber précocement (< 30 min) en l'absence de détresse respiratoire aiguë : le réveil postcritique est souvent lent et n'est pas, à lui seul, un critère d'EME réfractaire.",
      links: [
        { label: "Natrémie corrigée", to: "/calcul/natremie-corrigee" },
        { label: "Calcémie corrigée", to: "/calcul/calcemie-corrigee" },
      ],
      options: [
        { label: "Persistance des convulsions à 5 minutes", next: "emetcg-ligne1-rappel" },
        { label: "Arrêt des convulsions", next: "leaf-emetcg-resolu" },
      ],
    },
    "emetcg-ligne1-rappel": {
      type: "question",
      id: "emetcg-ligne1-rappel",
      title: "T + 5 min : persistance des convulsions",
      subtitle: "Deuxième dose de benzodiazépine",
      detail:
        "• Clonazépam 0,015 mg/kg IVD (2ᵉ injection).\n" +
        "• Rechercher et traiter la cause si objectivée :\n" +
        "   – Hypoglycémie → glucosé 30 %\n" +
        "   – Hyponatrémie → NaCl hypertonique 4,5 %\n" +
        "   – Hypomagnésémie → sulfate de magnésium\n" +
        "   – Méningite/méningoencéphalite → antibiothérapie ± corticothérapie ± aciclovir sans délai\n" +
        "   – Traumatisme crânien → neurosédation (intubation orotrachéale), imagerie, avis neurochirurgical\n" +
        "   – Femme enceinte, dénutrition, alcoolisme → vitamine B1\n" +
        "   – Éclampsie → sulfate de magnésium, extraction fœtale\n" +
        "   – Intoxication aux stabilisants de membrane → sels molaires de sodium",
      warning:
        "En cas de fièvre évocatrice d'une méningite : débuter sans délai l'antibiothérapie (± corticothérapie) puis réaliser l'imagerie cérébrale avant toute ponction lombaire (recherche d'une contre-indication/risque d'engagement) — ne pas inverser l'ordre.",
      options: [
        { label: "Persistance des convulsions 5 minutes de plus", next: "emetcg-ligne2" },
        { label: "Arrêt des convulsions", next: "leaf-emetcg-resolu" },
      ],
    },
    "emetcg-ligne2": {
      type: "question",
      id: "emetcg-ligne2",
      title: "T + 10 min : persistance — antiépileptique de 2ᵉ ligne",
      subtitle: "Solliciter le réanimateur dès cette étape",
      detail:
        "Un des 4 antiépileptiques de longue durée d'action, selon le terrain :\n" +
        "• Valproate de sodium — meilleure tolérance cardiovasculaire/respiratoire ; à éviter si cirrhose/alcoolisme (toxicité hépatique) ou femme enceinte/en âge de procréer (tératogène).\n" +
        "• Fosphénytoïne — déconseillée si cardiopathie évoluée (trouble de conduction, hypotension).\n" +
        "• Phénobarbital — effet dépresseur neurologique, hémodynamique et respiratoire (risque de coma médicamenteux).\n" +
        "• Lévétiracétam — bonne tolérance, efficacité peut-être inférieure aux autres aux doses usuelles.",
      warning:
        "Solliciter le médecin intensiviste-réanimateur dès cette ligne thérapeutique (USC si résolutif, réanimation si réfractaire), et d'emblée si l'EME est inaugural et évoque une pathologie aiguë grave (hémorragie intracrânienne, encéphalite...).",
      options: [
        { label: "Persistance des convulsions 30 minutes après", next: "leaf-eme-refractaire" },
        { label: "Arrêt des convulsions", next: "leaf-emetcg-resolu" },
      ],
    },
    "leaf-eme-refractaire": {
      type: "leaf",
      id: "leaf-eme-refractaire",
      title: "EME réfractaire (> 30 min après le traitement de 2ᵉ ligne)",
      items: [
        "Coma thérapeutique ≥ 24 h : propofol, midazolam ou thiopental.",
        "Intubation orotrachéale et ventilation mécanique invasive, en médecine intensive-réanimation.",
        "EEG dès que possible pour contrôler l'efficacité du traitement.",
      ],
      detail:
        "Exception : si évolution < 60 min chez un patient épileptique connu sans facteur d'agression cérébrale évidente, un autre antiépileptique de 2ᵉ ligne peut être tenté avant de recourir à la ventilation mécanique.",
      warning: "Rechercher et traiter la cause en parallèle : elle conditionne une grande partie du pronostic et de la mortalité.",
    },
    "leaf-emetcg-resolu": {
      type: "leaf",
      id: "leaf-emetcg-resolu",
      title: "Convulsions arrêtées",
      items: [
        "Traitement antiépileptique de relais à débuter, en association avec une benzodiazépine per os en prévention de la récidive (maintenue quelques jours).",
        "Surveillance rapprochée : paramètres vitaux, état respiratoire, reprise de conscience.",
        "Avis auprès du neurologue traitant (patient épileptique connu) pour réévaluer le traitement de fond.",
        "Enquête étiologique à poursuivre : imagerie cérébrale, EEG et/ou ponction lombaire selon le contexte.",
      ],
      detail:
        "Si trouble de conscience persistant 30 à 60 minutes après l'arrêt des crises : EEG à la recherche d'un état de mal larvé (activité épileptique sans manifestation motrice visible).",
      warning:
        "Ne pas confondre avec un coma post-critique attendu (effet sédatif des benzodiazépines) : celui-ci régresse typiquement en moins de 30 minutes et ne doit pas motiver une escalade thérapeutique.",
    },
  },
  source:
    "Collège des Enseignants de Médecine Intensive – Réanimation (CE-MIR), chapitre 30 « Convulsions et état de mal épileptique » (items 105 et 342) ; recommandations formalisées d'experts SRLF/SFMU 2018 ; classification ILAE 2017.",
  notes:
    "Couvre la crise tonico-clonique généralisée et l'EMETCG chez l'adulte (les plus fréquents et les plus graves) ; la prise en charge pédiatrique sera traitée séparément. Ne pas surdiagnostiquer une CTCG devant des atypies cliniques (évoquer une crise non épileptique psychogène) ; l'amélioration sous benzodiazépine ne confirme pas à elle seule le diagnostic d'épilepsie.",
};
