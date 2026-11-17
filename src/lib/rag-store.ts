export interface KnowledgeChunk {
  id: string;
  topic: string;
  title: string;
  content: string;
  source: string;
  keywords: string[];
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "kb_who_aq_guidelines",
    topic: "who_guidelines",
    title: "WHO 2021 Global Air Quality Guidelines for PM2.5",
    content: "The World Health Organization (WHO) updated its recommended guideline levels in 2021. For PM2.5: Annual average should not exceed 5 µg/m³; 24-hour average should not exceed 15 µg/m³ (not to be exceeded more than 3-4 days/year). PM2.5 penetrates deep into lung alveoli and crosses the air-blood barrier, increasing risks of stroke, ischemic heart disease, COPD, and lung cancer.",
    source: "WHO Global Air Quality Guidelines (2021)",
    keywords: ["who", "pm2.5", "limit", "standard", "annual", "24-hour", "alveoli", "health"]
  },
  {
    id: "kb_cpcb_aqi_breakpoints",
    topic: "aqi_scale",
    title: "CPCB and EPA AQI Categories & Health Impacts",
    content: "AQI 0-50 (Good): Minimal impact. AQI 51-100 (Moderate): Minor breathing discomfort to sensitive people. AQI 101-200 (Moderate / Sensitive): Discomfort to children and patients with asthma/heart disease. AQI 201-300 (Poor / Unhealthy): Breathing discomfort on prolonged exposure. AQI 301-400 (Very Poor / Severe): Respiratory illness on prolonged exposure. AQI 401-500+ (Severe+ / Hazardous): Affects healthy people and seriously impacts those with existing diseases. Emergency measures apply.",
    source: "Central Pollution Control Board (CPCB) India & US EPA AQI Standard",
    keywords: ["aqi", "cpcb", "breakpoint", "category", "severe", "poor", "hazardous", "pm2.5"]
  },
  {
    id: "kb_mask_standards",
    topic: "masks",
    title: "Mask Effectiveness: N95/FFP2 vs Surgical vs Cloth",
    content: "A certified N95 or FFP2 respirator with tight facial seal filters ≥95% of fine particulate matter (0.3 micron aerodynamic diameter). Standard surgical masks only offer 30-40% effective filtration due to extensive peripheral edge leaks. Simple cloth or handkerchief masks provide only 10-20% filtration and do NOT protect against toxic PM2.5 smog. Key tip: Ensure nose clip is pinched snugly and straps are behind the head, not loose over ears.",
    source: "CDC / NIOSH Respirator Filtration Science (2022)",
    keywords: ["mask", "n95", "ffp2", "kn95", "cloth", "surgical", "seal", "filtration"]
  },
  {
    id: "kb_inversion_ventilation",
    topic: "ventilation",
    title: "Winter Temperature Inversion & Safe Window Opening",
    content: "During winter, ground radiational cooling produces a nocturnal 'temperature inversion layer' where cold air is trapped beneath warmer air above. Smog accumulates within this shallow boundary layer, peaking between 10:00 PM and 9:00 AM. Opening windows early in the morning floods homes with toxic particulate. The optimal window for brief cross-ventilation (15-20 minutes) is between 1:00 PM and 4:00 PM when solar warming breaks the inversion and surface wind speeds rise.",
    source: "Indian Institute of Tropical Meteorology (IITM) & SAFAR",
    keywords: ["inversion", "window", "ventilation", "timing", "morning", "afternoon", "weather"]
  },
  {
    id: "kb_cr_box_purifier",
    topic: "diy_purifier",
    title: "DIY Corsi-Rosenthal (CR) Box Fan Purifier Engineering",
    content: "A Corsi-Rosenthal Box consists of a standard 20-inch box fan taped to 4 MERV 13 (or MERV 14 / F7) pleated furnace filters forming a 5-sided cube with a cardboard bottom. A cardboard shroud with a circular opening (14-15 inches diameter) taped to the fan face eliminates blade-tip backflow, boosting Clean Air Delivery Rate (CADR) to 250-350 CFM for PM2.5. Total cost is ₹3,000-₹4,500 compared to ₹15,000 for commercial HEPA units, with lower noise and higher airflow.",
    source: "UC Davis Dept of Civil & Environmental Engineering (Prather, Corsi, Rosenthal)",
    keywords: ["cr box", "corsi rosenthal", "diy", "box fan", "merv 13", "cadr", "filter", "cheap"]
  },
  {
    id: "kb_indoor_hacks_myths",
    topic: "indoor_hacks",
    title: "Indoor Air Quality Hacks: Facts vs Plant Myths",
    content: "Fact 1: Damp wet-mopping removes settled particulate; sweeping kicks PM2.5 back into the breathing zone. Fact 2: Seal bottom door gaps and drafty windows with simple foam weatherstripping or rolled towels to cut outdoor infiltration by 40%. Fact 3 (The Plant Myth): Houseplants (snake plant, spider plant) remove virtually ZERO particulate matter (PM2.5) in realistic room airflow conditions. While plants remove trace volatile VOCs in sealed NASA chambers, you would need 10 to 100 plants per square meter to replicate one air purifier. Do not rely on plants for smog protection.",
    source: "Drexel University Indoor Air Study (Cummings & Waring, 2019)",
    keywords: ["plants", "myth", "indoor", "mopping", "sealing", "weatherstrip", "dust", "hacks"]
  },
  {
    id: "kb_children_and_exercise",
    topic: "vulnerable_groups",
    title: "Protecting Children, Elderly, and Outdoor Exercise Guidance",
    content: "Children breathe 50% more air per kilogram of body weight than adults, and their lung alveoli are still developing through age 8. When AQI > 150, all vigorous outdoor exercise, sports periods, and marathon walks must be shifted indoors or rescheduled. When AQI > 300, school outdoor assemblies and recess should be canceled. Elderly individuals with coronary disease or COPD must avoid morning walking clubs until afternoon hours when temperature inversion lifts.",
    source: "American Academy of Pediatrics (AAP) Environmental Health Guidance",
    keywords: ["children", "toddler", "school", "sports", "elderly", "exercise", "walk"]
  }
];

/**
 * Simple keyword-based semantic retrieval over curated KB
 */
export function queryKnowledgeBase(query: string, topK: number = 3): KnowledgeChunk[] {
  const queryTokens = query.toLowerCase().split(/\W+/).filter(Boolean);
  
  const scored = KNOWLEDGE_BASE.map(chunk => {
    let score = 0;
    queryTokens.forEach(token => {
      if (chunk.keywords.some(k => k.includes(token) || token.includes(k))) score += 4;
      if (chunk.title.toLowerCase().includes(token)) score += 3;
      if (chunk.content.toLowerCase().includes(token)) score += 1;
    });
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => s.chunk);
}
