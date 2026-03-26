export interface Module {
  id: string;
  num: string;
  title: string;
  desc: string;
  dur: string;
  price: number;
  obj: string[];
  tools: string[];
}

export interface Track {
  id: string;
  label: string;
  desc: string;
  color: string;
  dur: string;
  price: number;
  modules: Module[];
}

export const PARCOURS: Record<string, Track> = {
  regbim: {
    id: "regbim",
    label: "Réglementation & BIM",
    desc: "Maîtrisez la réglementation BTP Antilles-Guyane et le BIM : parasismique, accessibilité, incendie, urbanisme.",
    color: "#1A3A7A",
    dur: "30,5h · 3,5 jours",
    price: 1450,
    modules: [
      { id: "r1", num: "Module 1", title: "Panorama réglementaire", desc: "CCH, PS-MI, RT Antilles-Guyane", dur: "½ j · 3h", price: 250, obj: ["Code de la Construction", "Règles parasismiques Martinique", "Normes thermiques RT/RE2020", "Documents graphiques permis"], tools: ["AutoCAD", "ArchiCAD"] },
      { id: "r2", num: "Module 2", title: "Accessibilité ERP & PMR", desc: "Loi 2005, ERP, logements adaptés", dur: "½ j · 3h", price: 250, obj: ["Loi 2005, arrêté 2006", "Classification ERP", "Modélisation espace accessible"], tools: ["Revit", "ArchiCAD"] },
      { id: "r3j", num: "Journée 1", title: "Réglementation complète (1+2)", desc: "Panorama + accessibilité — 6h", dur: "1 j · 6h", price: 420, obj: ["Panorama complet", "Accessibilité avec atelier", "Vérification maquette numérique"], tools: ["AutoCAD", "ArchiCAD", "Revit"] },
      { id: "r4", num: "Module 3", title: "Sécurité incendie BIM", desc: "Dégagements, Navisworks Clash", dur: "½ j · 3h", price: 250, obj: ["Réglementation incendie", "Contraintes incendie dans BIM", "Clash Detection Navisworks"], tools: ["Revit", "Navisworks"] },
      { id: "r5", num: "Module 4", title: "Urbanisme & PC dématérialisé", desc: "PLU, DAU, plateformes MQ", dur: "½ j · 3h", price: 250, obj: ["PLU/PLUi", "Autorisations urbanisme", "Dépôt dématérialisé"], tools: ["Plateformes DAU", "AutoCAD"] },
      { id: "r5j", num: "Journée 2", title: "Incendie + Urbanisme (3+4)", desc: "Audit incendie + PC — 6h", dur: "1 j · 6h", price: 420, obj: ["Sécurité incendie Navisworks", "Urbanisme numérique", "Atelier pratique double"], tools: ["Revit", "Navisworks", "AutoCAD"] },
      { id: "r6", num: "Module 5", title: "Étude de cas — audit réel", desc: "Maquette BIM, non-conformités", dur: "½ j · 3h", price: 250, obj: ["Projet martiniquais", "Grille d'audit réglementaire", "Solutions correctives"], tools: ["Revit", "Navisworks"] },
      { id: "r7", num: "Module 6", title: "Atelier final — conformité", desc: "Livrable professionnel", dur: "½ j · 3h", price: 250, obj: ["Audit autonome", "Fiche de conformité", "Plan d'action correctif"], tools: ["Revit", "Navisworks", "AutoCAD"] }
    ]
  },
  visu3d: {
    id: "visu3d",
    label: "Visualisation 3D",
    desc: "Du croquis au rendu photoréaliste : modélisation 3D, textures PBR, vidéo 4K, visite virtuelle VR.",
    color: "#0a7d8f",
    dur: "42h · 7 jours",
    price: 2800,
    modules: [
      { id: "v1", num: "Module 1", title: "Modélisation 3D principes", desc: "SketchUp/Revit : maquette", dur: "½ j · 3h", price: 250, obj: ["Types de modélisation", "Structuration maquette", "Assemblage murs/dalles/toitures"], tools: ["SketchUp", "Revit"] },
      { id: "v2", num: "Module 2", title: "Photogrammétrie terrain", desc: "Capture drone, reconstruction", dur: "½ j · 3h", price: 250, obj: ["Principe photogrammétrie", "Protocole prise de vue", "Intégration contexte réel"], tools: ["SketchUp", "Agisoft Metashape"] },
      { id: "v12j", num: "Journée 1", title: "Modélisation complète (1+2)", desc: "Maquette + photogrammétrie", dur: "1 j · 6h", price: 420, obj: ["Modélisation 3D complète", "Photogrammétrie intégrée", "Géo-référencement"], tools: ["SketchUp", "Revit", "Metashape"] },
      { id: "v3", num: "Module 3", title: "Textures & matériaux PBR", desc: "Twinmotion/Enscape", dur: "½ j · 3h", price: 250, obj: ["Canaux PBR", "Matériaux personnalisés", "Bibliothèques HQ"], tools: ["Twinmotion", "Enscape"] },
      { id: "v4", num: "Module 4", title: "Lumière & paysage tropical", desc: "Soleil, HDRI, végétation MQ", dur: "½ j · 3h", price: 250, obj: ["Lumière naturelle latitude MQ", "Rendu nocturne", "Atmosphère tropicale"], tools: ["Twinmotion", "Enscape"] },
      { id: "v34j", num: "Journée 2", title: "Ambiance & rendu HD (3+4)", desc: "Matériaux + lumière — 6h", dur: "1 j · 6h", price: 420, obj: ["Matériaux PBR complets", "Éclairage tropical", "Export HD et 360°"], tools: ["Twinmotion", "Enscape"] },
      { id: "v5", num: "Module 5", title: "Rendu photoréaliste", desc: "Paramétrage, export HD", dur: "½ j · 3h", price: 250, obj: ["Comparatif moteurs rendu", "Paramétrage GI", "4 vues HD d'un projet"], tools: ["Twinmotion", "Enscape"] },
      { id: "v6", num: "Module 6", title: "Vidéo architecturale", desc: "Caméra, animation, 4K", dur: "½ j · 3h", price: 250, obj: ["Cadrage cinématographique", "Trajectoires caméra", "Export 4K + post-prod"], tools: ["Twinmotion", "CapCut"] },
      { id: "v7", num: "Module 7", title: "Visite virtuelle VR", desc: "Enscape VR, lien web, QR", dur: "½ j · 3h", price: 250, obj: ["Technologies VR", "Visite navigable", "Export lien/QR code"], tools: ["Enscape", "Twinmotion"] },
      { id: "v67j", num: "Journée 3", title: "Immersif complet (6+7)", desc: "Vidéo 4K + VR — 6h", dur: "1 j · 6h", price: 420, obj: ["Vidéo architecturale", "Visite virtuelle interactive", "Dossier immersif complet"], tools: ["Twinmotion", "Enscape", "CapCut"] },
      { id: "v8", num: "Module 8", title: "Unreal Engine 5", desc: "Nanite, Lumen, Blueprints", dur: "½ j · 3h", price: 250, obj: ["Interface UE5", "Import via Datasmith", "Blueprints interactifs"], tools: ["Unreal Engine 5"] },
      { id: "v9", num: "Module 9", title: "Projet de synthèse", desc: "Rendus + vidéo + VR", dur: "½ j · 3h", price: 250, obj: ["Projet personnel", "4 rendus HD + vidéo + VR", "Simulation client"], tools: ["Twinmotion", "Enscape", "UE5"] }
    ]
  },
  ia: {
    id: "ia",
    label: "IA & Architecture",
    desc: "Intégrez l'IA générative dans votre pratique architecturale : prompting, moodboards, Forma, workflows.",
    color: "#7B2D8E",
    dur: "42h · 7 jours",
    price: 2800,
    modules: [
      { id: "i1", num: "Module 1", title: "Introduction IA générative", desc: "Principes, éthique, RGPD", dur: "½ j · 3h", price: 250, obj: ["Réseaux de neurones", "Panorama outils IA", "Enjeux RGPD/éthique"], tools: [] },
      { id: "i2", num: "Module 2", title: "Prompting architectural", desc: "Midjourney vs DALL-E", dur: "½ j · 3h", price: 250, obj: ["Anatomie d'un prompt", "Vocabulaire archi spécifique", "Techniques avancées"], tools: ["Midjourney", "DALL-E"] },
      { id: "i12j", num: "Journée 1", title: "Fondamentaux IA (1+2)", desc: "Principes + prompting — 6h", dur: "1 j · 6h", price: 420, obj: ["Panorama IA générative", "Maîtrise du prompting", "Atelier visuels archi"], tools: ["Midjourney", "DALL-E"] },
      { id: "i3", num: "Module 3", title: "Moodboards IA", desc: "PromeAI, LookX", dur: "½ j · 3h", price: 250, obj: ["Workflow moodboard IA", "Ambiances intérieur/extérieur", "Planche d'intention en 45 min"], tools: ["PromeAI", "Canva IA"] },
      { id: "i4", num: "Module 4", title: "Concepts & façades IA", desc: "PromeAI, LookX, ControlNet", dur: "½ j · 3h", price: 250, obj: ["Croquis vers rendu réaliste", "Variantes stylistiques", "4 propositions esthétiques"], tools: ["PromeAI", "LookX"] },
      { id: "i34j", num: "Journée 2", title: "Conception IA (3+4)", desc: "Moodboards + façades — 6h", dur: "1 j · 6h", price: 420, obj: ["Moodboards professionnels", "Variantes de façade", "Pipeline brief → client"], tools: ["PromeAI", "LookX", "Midjourney"] },
      { id: "i5", num: "Module 5", title: "Autodesk Forma", desc: "Ensoleillement, vent, bruit", dur: "½ j · 3h", price: 250, obj: ["Analyse ensoleillement", "Optimisation implantation", "Qualité de vie urbaine"], tools: ["Autodesk Forma"] },
      { id: "i6", num: "Module 6", title: "ChatGPT workflow archi", desc: "Notices, automatisation", dur: "½ j · 3h", price: 250, obj: ["Notice descriptive IA", "Programme fonctionnel", "Automatisation tâches"], tools: ["ChatGPT", "Claude"] },
      { id: "i56j", num: "Journée 3", title: "IA workflow agence (5+6)", desc: "Forma + LLM — 6h", dur: "1 j · 6h", price: 420, obj: ["Analyse urbaine IA", "LLM en agence", "Pipeline IA complet"], tools: ["Autodesk Forma", "ChatGPT"] },
      { id: "i7", num: "Module 7", title: "Pipeline IA complet", desc: "Esquisse → dossier", dur: "½ j · 3h", price: 250, obj: ["Cartographie valeur IA", "Workflow bout-en-bout", "Cohérence visuelle"], tools: ["Midjourney", "PromeAI"] },
      { id: "i8", num: "Module 8", title: "IA dans outils métier", desc: "Revit, SketchUp, Firefly", dur: "½ j · 3h", price: 250, obj: ["IA dans Revit/SketchUp", "Adobe Firefly retouche", "Veille IA outils"], tools: ["Revit", "Photoshop Firefly"] },
      { id: "i9", num: "Module 9", title: "Atelier final IA A-Z", desc: "Brief réel, livrable complet", dur: "½ j · 3h", price: 250, obj: ["Brief client réaliste", "Moodboard + rendu + notice", "Feuille de route post-formation"], tools: ["Midjourney", "PromeAI", "ChatGPT"] }
    ]
  }
};

// Helper to get module by ID
export function getModuleById(id: string): Module | undefined {
  for (const track of Object.values(PARCOURS)) {
    const mod = track.modules.find(m => m.id === id);
    if (mod) return mod;
  }
  return undefined;
}
