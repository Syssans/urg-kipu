import type { DecisionTree } from "./types";

export const seizure: DecisionTree = {
  id: "convulsions",
  name: "Crise convulsive et état de mal épileptique",
  shortName: "Convulsions",
  summary:
    "Diagnostic et prise en charge chronométrée d'une crise convulsive tonico-clonique généralisée et de l'état de mal épileptique, chez l'adulte et chez l'enfant.",
  rootId: "age-gate",
  nodes: {
    "age-gate": {
      type: "question",
      id: "age-gate",
      title: "Âge du patient ?",
      subtitle: "Détermine le protocole applicable : posologies, voies d'administration et seuils diffèrent chez l'enfant.",
      options: [
        { label: "Adulte", next: "duree-crise" },
        { label: "Nourrisson / enfant", next: "ped-etat" },
      ],
    },

    // --- Adulte ---
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

    // --- Enfant / nourrisson ---
    "ped-etat": {
      type: "question",
      id: "ped-etat",
      title: "Crise chez le nourrisson/l'enfant : état actuel ?",
      subtitle: "Mise en condition : liberté des voies aériennes (jamais de canule de Guedel), position latérale de sécurité, monitoring cardiorespiratoire + température.",
      detail: "Dans la grande majorité des cas, la crise a déjà cédé au moment de l'évaluation médicale : l'enfant est vu à distance de l'épisode.",
      options: [
        { label: "Crise déjà cédée (situation la plus fréquente)", next: "ped-cedee" },
        { label: "Crise en cours, persistante ≥ 5 minutes", next: "ped-bzd1" },
      ],
    },
    "ped-cedee": {
      type: "question",
      id: "ped-cedee",
      title: "Crise cédée — Rechercher les signes de gravité et le contexte",
      detail:
        "Signes d'urgence à rechercher systématiquement :\n" +
        "• Neuro : déficit focal ou trouble de conscience ne s'améliorant pas entre 2 examens espacés d'au moins 30 min.\n" +
        "• Respiratoire : bradypnée, irrégularités, apnées, cyanose, encombrement bronchique majeur.\n" +
        "• Hémodynamique : tachycardie, temps de recoloration cutanée allongé, marbrures, extrémités froides, pouls périphériques mal perçus.\n" +
        "• Contexte infectieux grave : sepsis sévère, purpura fébrile, syndrome méningé/encéphalitique.\n" +
        "• Autres : pâleur/hématomes multiples (maltraitance ?), coma, suspicion d'intoxication.",
      warning:
        "Terrain à risque : crise sans fièvre avant 12 mois (fréquence des causes symptomatiques graves : hématome sous-dural, troubles ioniques) ; crise fébrile avant 6 mois (risque de méningite/encéphalite).",
      links: [{ label: "Glasgow pédiatrique", to: "/scores/gcs-pediatrique" }],
      options: [
        { label: "Fièvre associée", next: "ped-fievre" },
        { label: "Pas de fièvre", next: "ped-sans-fievre" },
      ],
    },
    "ped-fievre": {
      type: "question",
      id: "ped-fievre",
      title: "Crise fébrile : simple ou complexe ?",
      detail:
        "Crise fébrile = crise liée à la fièvre chez un enfant de 6 mois à 5 ans, au développement psychomoteur normal, sans atteinte du SNC. Un seul critère de complexité suffit à classer la crise comme complexe.",
      options: [
        {
          label: "Simple : 1-5 ans, brève (< 15 min), 1 seul épisode/24 h, généralisée, pas de déficit post-critique, examen neuro normal",
          next: "leaf-ped-fievre-simple",
        },
        {
          label: "Complexe : < 1 an, ≥ 15 min, plus d'1 épisode/24 h, à début focal, déficit post-critique, antécédent/examen neuro anormal",
          next: "leaf-ped-fievre-complexe",
        },
      ],
    },
    "leaf-ped-fievre-simple": {
      type: "leaf",
      id: "leaf-ped-fievre-simple",
      title: "Crise fébrile simple",
      items: [
        "Aucun examen complémentaire nécessaire (en dehors du bilan de fièvre éventuellement indiqué).",
        "Pas de ponction lombaire ni d'imagerie cérébrale en l'absence de signe de méningite/encéphalite.",
        "Rassurer les parents sur la bénignité ; expliquer la conduite à tenir en cas de récidive.",
        "Consultation médicale systématique même si la crise a cédé, pour rechercher la cause de la fièvre.",
      ],
      detail:
        "Risque de récidive ultérieure : 20 à 30 %. Les antipyrétiques ne préviennent pas la récidive. En cas de récidive à domicile : diazépam intrarectal si la crise ne cède pas en 5 minutes ; appeler les secours médicalisés si elle persiste malgré cela.",
      warning:
        "Avis neuropédiatrique si : crise prolongée avant 1 an, crise focale et prolongée ou focale et répétitive, répétition d'une crise fébrile complexe, retard de développement ou examen neurologique anormal.",
    },
    "leaf-ped-fievre-complexe": {
      type: "leaf",
      id: "leaf-ped-fievre-complexe",
      title: "Crise fébrile complexe",
      items: [
        "Hospitalisation systématique.",
        "Ponction lombaire si : suspicion de méningite (syndrome méningé, fontanelle bombante, trouble du tonus) ou d'encéphalite (trouble du comportement, crise focale et/ou > 15 min, déficit post-critique) ; systématique avant 6 mois même si la crise est isolée et résolutive.",
        "Traitement probabiliste par aciclovir en urgence si suspicion de méningo-encéphalite herpétique (crise fébrile focale et/ou prolongée, surtout avec anomalies neurologiques intercritiques).",
        "Scanner cérébral non systématique avant la PL, à discuter selon le contexte ; ne doit pas retarder l'antibiothérapie/les antiviraux.",
        "Avis neuropédiatrique.",
      ],
      warning: "Après 6 mois, l'âge seul ne justifie pas une ponction lombaire en l'absence de signe de méningite ou d'encéphalite.",
    },
    "ped-sans-fievre": {
      type: "question",
      id: "ped-sans-fievre",
      title: "Crise sans fièvre : âge du nourrisson/enfant ?",
      detail:
        "Causes à évoquer : évènement occasionnel isolé, traumatisme crânien/hématome sous-dural, première crise d'une épilepsie débutante ; plus rarement cause métabolique (surtout < 6 mois : hypo/hypernatrémie, hypoglycémie, hypocalcémie), AVC, tumeur, HTA, SHU, cause toxique.",
      options: [
        { label: "< 1 an", next: "leaf-ped-sans-fievre-nourrisson" },
        { label: "≥ 1 an", next: "leaf-ped-sans-fievre-enfant" },
      ],
    },
    "leaf-ped-sans-fievre-nourrisson": {
      type: "leaf",
      id: "leaf-ped-sans-fievre-nourrisson",
      title: "Crise sans fièvre, âge < 1 an",
      items: [
        "Scanner cérébral (avec injection) en urgence : systématique à cet âge.",
        "Bilan biologique systématique : ionogramme sanguin (natrémie), calcémie, glycémie, NFS-plaquettes.",
        "Évoquer en priorité un hématome sous-dural aigu (accidentel ou maltraitance) hors contexte infectieux.",
        "EEG après la crise (non urgent), suivi d'un avis neuropédiatrique spécialisé.",
      ],
      warning: "Rechercher systématiquement des signes de maltraitance : hématomes multiples, ecchymoses, discordance anamnestique.",
    },
    "leaf-ped-sans-fievre-enfant": {
      type: "leaf",
      id: "leaf-ped-sans-fievre-enfant",
      title: "Crise sans fièvre, âge ≥ 1 an",
      items: [
        "Scanner cérébral en urgence seulement si : signe de localisation à l'examen, et/ou troubles de conscience persistant > 30 min après la fin de la crise.",
        "Glycémie capillaire sans intérêt en l'absence de contexte évocateur (diabète, resucrage).",
        "Bilan biologique (iono, calcémie, glycémie, NFS-plaquettes) seulement en cas de point d'appel (antécédents, contexte, signes de gravité).",
        "EEG non urgent mais systématique après une première crise non fébrile ou une crise inhabituelle chez un épileptique connu, suivi d'un avis spécialisé.",
      ],
      detail: "Si crises récidivantes sans cause identifiée : évoquer une épilepsie débutante, avis neuropédiatrique.",
    },
    "ped-bzd1": {
      type: "question",
      id: "ped-bzd1",
      title: "État de mal menaçant (≥ 5 min) — 1ʳᵉ benzodiazépine",
      subtitle: "Mise en condition : liberté des voies aériennes (pas de canule de Guedel), PLS, monitoring cardiorespiratoire + température.",
      detail: "Benzodiazépine : diazépam intrarectal, ou midazolam buccal.",
      warning: "Noter l'heure de début de la crise et l'heure de chaque injection.",
      options: [
        { label: "Persistance à 10 minutes (5 min après la 1ʳᵉ injection)", next: "ped-bzd2" },
        { label: "Arrêt des convulsions", next: "leaf-ped-resolu" },
      ],
    },
    "ped-bzd2": {
      type: "question",
      id: "ped-bzd2",
      title: "T + 5 min : persistance — 2ᵉ benzodiazépine",
      detail: "Clonazépam IV lente (IVL), de préférence en milieu hospitalier.",
      options: [
        { label: "Persistance malgré la 2ᵉ dose (nouvel échec)", next: "leaf-ped-eme-etabli" },
        { label: "Arrêt des convulsions", next: "leaf-ped-resolu" },
      ],
    },
    "leaf-ped-eme-etabli": {
      type: "leaf",
      id: "leaf-ped-eme-etabli",
      title: "État de mal épileptique établi",
      items: [
        "Anticonvulsant IV : phénytoïne, ou lévétiracétam, ou phénobarbital — au mieux en unité de réanimation.",
        "Poursuite de la surveillance des constantes, de la conscience et de l'examen neurologique.",
        "Recherche et traitement de la cause en parallèle (fièvre, trouble ionique, traumatisme, toxique).",
      ],
      detail: "État de mal établi = crises continues ou succession de crises sans amélioration de la conscience sur une période de 30 minutes.",
      warning: "Solliciter un avis réanimatoire pédiatrique dès cette étape.",
    },
    "leaf-ped-resolu": {
      type: "leaf",
      id: "leaf-ped-resolu",
      title: "Convulsions arrêtées",
      items: [
        "Surveillance des constantes vitales, évaluation répétée de la conscience et examen neurologique à la recherche de signes focaux durables.",
        "Rechercher la cause : fièvre associée ? contexte évocateur (traumatisme, trouble ionique, toxique) ?",
        "Traitement étiologique et antipyrétique (si fièvre) à débuter au plus vite.",
        "Avis neuropédiatrique si première crise non fébrile, crise inhabituelle chez un épileptique connu, ou critères de gravité.",
      ],
      detail: "Un examen neurologique normal après résolution n'élimine pas la nécessité de rechercher une cause (cf. bilan selon fièvre/âge).",
    },
  },
  source:
    "Adulte : Collège des Enseignants de Médecine Intensive – Réanimation (CE-MIR), chapitre 30 « Convulsions et état de mal épileptique » (items 105 et 342). " +
    "Enfant : Collège National des Pédiatres Universitaires (CNPU), chapitre 52 « Convulsions, crises d'épilepsie, épilepsie » (items 346 et 105). " +
    "Recommandations formalisées d'experts SRLF/SFMU, en collaboration avec le GFRUP pour l'enfant, 2018 ; classification ILAE 2017.",
  notes:
    "Chez l'enfant, l'état de mal « menaçant » est défini par une crise ≥ 5 minutes (probabilité plus grande de se poursuivre que de s'arrêter spontanément) et l'état de mal « établi » par des crises continues ou successives sans amélioration de la conscience sur 30 minutes ; ne jamais utiliser de canule de Guedel chez l'enfant en crise. Chez l'adulte, ne pas surdiagnostiquer une CTCG devant des atypies cliniques (évoquer une crise non épileptique psychogène) ; l'amélioration sous benzodiazépine ne confirme pas à elle seule le diagnostic d'épilepsie.",
};
