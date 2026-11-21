import { DailyCleanAirPlan, UserProfile, AQIData, ChatMessage } from "@/types";
import { queryKnowledgeBase, KnowledgeChunk } from "./rag-store";
import { logger } from "./logger";

export interface LLMProviderConfig {
  apiKey?: string;
  model?: string;
}

/**
 * Generate persona-specific Daily Clean Air Plan (Structured Output)
 */
export async function generateDailyPlan(
  profile: UserProfile,
  aqiData: AQIData,
  language: 'en' | 'hi' = 'en',
  customApiKey?: string
): Promise<DailyCleanAirPlan> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey && process.env.NODE_ENV !== 'test') {
    try {
      const plan = await callGeminiPlan(apiKey, profile, aqiData, language);
      if (plan) return plan;
    } catch (err) {
      logger.warn("Gemini API call failed, falling back to deterministic generator:", err);
    }
  }

  // Deterministic Demo Generator (Works 100% offline and zero-config)
  return generateDeterministicDailyPlan(profile, aqiData, language);
}

/**
 * Generate grounded Chat Assistant response
 */
export async function generateChatResponse(
  userQuery: string,
  history: ChatMessage[],
  profile: UserProfile,
  aqiData: AQIData,
  language: 'en' | 'hi' = 'en',
  customApiKey?: string
): Promise<{ text: string; citations: string[]; suggestedFollowUps: string[] }> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const retrievedChunks = queryKnowledgeBase(userQuery, 3);
  const citations = retrievedChunks.map(c => c.source);

  if (apiKey && process.env.NODE_ENV !== 'test') {
    try {
      const response = await callGeminiChat(apiKey, userQuery, history, profile, aqiData, retrievedChunks, language);
      if (response) return response;
    } catch (err) {
      logger.warn("Gemini Chat call failed, falling back to grounded rule engine:", err);
    }
  }

  // Grounded Deterministic Chat Engine
  return generateDeterministicChatReply(userQuery, profile, aqiData, retrievedChunks, language);
}

/**
 * Deterministic fallback plan generator tailored to exact profile and AQI
 */
function generateDeterministicDailyPlan(
  profile: UserProfile,
  aqiData: AQIData,
  language: 'en' | 'hi'
): DailyCleanAirPlan {
  const isHindi = language === 'hi';
  const aqi = aqiData.aqi;
  const isSevere = aqi >= 300;
  const hasSensitives = profile.members.some(m => m.sensitivities.length > 0 && m.sensitivities[0] !== 'none');

  const headline = isHindi
    ? isSevere
      ? `🚨 गंभीर वायु प्रदूषण चेतावनी (AQI ${aqi}) - सुरक्षित घर व यात्रा योजना`
      : `🛡️ आज की वायु सुरक्षा योजना (AQI ${aqi})`
    : isSevere
      ? `🚨 Severe Smog Warning (AQI ${aqi}) - High-Protection Action Plan`
      : `🛡️ Clean-Air Daily Action Routine (AQI ${aqi})`;

  const generalAdvice = isHindi
    ? `आज वायुमंडल में PM2.5 की सघनता सामान्य से ${Math.round(aqiData.pm25 / 15)} गुना अधिक है। सुबह की सैर पूरी तरह टालें और घर के दरवाजों के नीचे गीला कपड़ा लगाएं।`
    : `Today's PM2.5 levels (${aqiData.pm25} µg/m³) are ${Math.round(aqiData.pm25 / 15)}x above the WHO 24-hour safety benchmark (15 µg/m³). Ground inversion will trap smoke until 11:30 AM. Strictly avoid morning outdoor exercise.`;

  const maskRec = {
    recommended: aqi > 100,
    type: "N95 / FFP2 / KN95" as const,
    when: isHindi 
      ? "घर से बाहर निकलते ही हर समय पहनें (विशेष रूप से मेट्रो/बस/बाइक यात्रा पर)"
      : "Mandatory whenever stepping outdoors, particularly during vehicular transit and street walking.",
    fitTip: isHindi
      ? "नाक की क्लिप को दोनों हाथों से मजबूती से दबाएं ताकि किनारे से हवा न घुसे।"
      : "Pinch the metal nose bridge firmly with both index fingers to prevent peripheral air leaks."
  };

  const blocks = [
    {
      id: "b_morning",
      title: isHindi ? "सुबह 06:30 - 08:30: सुबह का वेंटिलेशन नियंत्रण" : "06:30 - 08:30 Morning: Trap Mitigation",
      timeRange: "06:30 - 08:30",
      period: "morning" as const,
      action: isHindi
        ? "खिड़कियां पूरी तरह बंद रखें। फर्श पर झाड़ू लगाने के बजाय गीला पोछा लगाएं।"
        : "Keep all balconies and exterior windows tightly shut. Replace sweeping with damp wet-mopping to prevent particulate resuspension.",
      why: isHindi
        ? "सर्दियों में ठंडी रात के कारण धुआं जमीन के पास जमा रहता है। झाड़ू लगाने से धूल वापस सांस में जाती है।"
        : "Cold air pooling traps vehicle exhaust and biomass smoke at surface level. Wet-mopping traps settled micro-dust without kicking it into breathing air.",
      impact: {
        pm25AvoidedUg: 180,
        cigarettesAvoided: 0.5,
        co2eSavedKg: 0,
        moneySavedInr: 0
      }
    },
    {
      id: "b_commute",
      title: isHindi ? "08:30 - 09:45: स्वच्छ आवागमन रणनीति" : "08:30 - 09:45: Commute Protection Strategy",
      timeRange: "08:30 - 09:45",
      period: "commute" as const,
      action: profile.commuteMode === 'two_wheeler'
        ? (isHindi 
            ? "दुपहिया वाहन पर सिर के पीछे बंधी N95 मास्क पहनें और संभव हो तो मेट्रो का प्रयोग करें।"
            : "Wear a certified N95 with headbands (not ear loops) under helmet, or take Metro for peak corridor travel.")
        : (isHindi
            ? "मेट्रो का उपयोग करें या कार का AC 'Recirculation (अंदर की हवा)' मोड पर रखें।"
            : "Opt for Metro rail, or keep car AC set to internal recirculation mode to block tunnel particulate ingress."),
      why: isHindi
        ? "सड़क पर वाहन उत्सर्जन के सीधे संपर्क से PM2.5 का जोखिम 4 गुना बढ़ जाता है।"
        : "Direct on-road tailpipe plumes expose commuters to toxic ultrafine carbon and NOx at 4x ambient background levels.",
      impact: {
        pm25AvoidedUg: 420,
        cigarettesAvoided: 1.3,
        co2eSavedKg: 1.8,
        moneySavedInr: 45
      }
    },
    {
      id: "b_afternoon",
      title: isHindi ? "13:30 - 15:30: इष्टतम दोपहर वेंटिलेशन विंडो" : "13:30 - 15:30: Optimal Cross-Ventilation Window",
      timeRange: "13:30 - 15:30",
      period: "outdoor" as const,
      action: isHindi
        ? "यदि आवश्यक हो तो 15-20 मिनट के लिए क्रॉस-वेंटिलेशन करें, फिर खिड़कियां बंद कर प्यूरीफायर चलाएं।"
        : "Execute a brief 15-20 minute cross-ventilation flush if indoor CO2 feels elevated, then reseal and switch on air filtration.",
      why: isHindi
        ? "दोपहर में धूप निकलने से इनवर्जन लेयर कमजोर होती है और हवा थोड़ी साफ होती है।"
        : "Solar insolation warms the ground, breaking nocturnal boundary inversion and promoting vertical mixing. Particulate levels reach their daily minimum.",
      impact: {
        pm25AvoidedUg: 120,
        cigarettesAvoided: 0.4,
        co2eSavedKg: 0,
        moneySavedInr: 0
      }
    },
    {
      id: "b_evening",
      title: isHindi ? "18:00 - 20:30: शाम का कुकिंग व सीलिंग प्रबंधन" : "18:00 - 20:30: Cooking & Gap Sealing Protocol",
      timeRange: "18:00 - 20:30",
      period: "indoor" as const,
      action: isHindi
        ? "रसोई में खाना बनाते समय एग्जॉस्ट फैन चलाएं और दरवाजे के नीचे तौलिया या रबर स्ट्रिप लगाएं।"
        : "Operate kitchen exhaust on high during frying; block lower exterior door gaps with rolled towels or silicone draft guards.",
      why: isHindi
        ? "खाना पकाने से घर के अंदर PM2.5 300 µg/m³ तक पहुंच सकता है। एग्जॉस्ट इसे बाहर निकालता है।"
        : "High-heat cooking and tadka create indoor PM2.5 surges up to 350 µg/m³. Sealing gaps blocks evening traffic rush-hour infiltration.",
      impact: {
        pm25AvoidedUg: 310,
        cigarettesAvoided: 0.9,
        co2eSavedKg: 0,
        moneySavedInr: 0
      }
    },
    {
      id: "b_sleep",
      title: isHindi ? "22:00 - 06:00: रात की स्वच्छ नींद व्यवस्था" : "22:00 - 06:00: Clean Sleep Sanctuary",
      timeRange: "22:00 - 06:00",
      period: "sleep" as const,
      action: isHindi
        ? "सोने के कमरे का दरवाजा बंद रखें और एयर प्यूरीफायर (या CR बॉक्स) को मीडियम स्पीड पर चालू रखें।"
        : "Close bedroom door to restrict volume; operate room purifier or Corsi-Rosenthal box on medium quiet setting.",
      why: isHindi
        ? "रात में 8 घंटे लगातार स्वच्छ हवा में सांस लेने से फेफड़ों की सूजन कम होती है।"
        : "8 continuous hours in sub-25 µg/m³ filtered air allows pulmonary airway lining to clear particulates and restores endothelial function.",
      impact: {
        pm25AvoidedUg: 680,
        cigarettesAvoided: 2.1,
        co2eSavedKg: 0,
        moneySavedInr: 0
      }
    }
  ];

  const childrenAdvice = isHindi
    ? "छोटे बच्चों को शाम के समय खुले मैदान में न दौड़ने दें। स्कूलों को आउटडोर असेंबली बंद कर इनडोर एक्टिविटी करानी चाहिए।"
    : "Children have higher ventilation rates per kg body weight. Restrict outdoor playground activity, sports matches, and open-air school assemblies until AQI drops below 150.";

  const ventStrategy = isHindi
    ? "सुबह 06:00 से 11:00 बजे के बीच खिड़कियां बिल्कुल न खोलें। केवल दोपहर 1:30 से 3:30 के बीच संक्षिप्त वेंटिलेशन करें।"
    : "Strictly avoid morning window opening (05:00 - 11:00 AM) during boundary inversion. Restrict all air exchange to the solar peak window (13:30 - 15:30).";

  return {
    id: `plan_${Date.now()}`,
    date: new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    headline,
    generalAdvice,
    maskRecommendation: maskRec,
    blocks,
    childrenOutdoorAdvice: childrenAdvice,
    ventilationStrategy: ventStrategy,
    citations: [
      "WHO Global Air Quality Guidelines (2021)",
      "Central Pollution Control Board (CPCB) Winter Action Protocols",
      "UC Davis Corsi-Rosenthal Air Cleaner Performance Evaluation"
    ]
  };
}

/**
 * Deterministic grounded chat replies
 */
function generateDeterministicChatReply(
  query: string,
  profile: UserProfile,
  aqiData: AQIData,
  retrieved: KnowledgeChunk[],
  language: 'en' | 'hi'
) {
  const isHi = language === 'hi';
  const q = query.toLowerCase();
  const aqi = aqiData.aqi;
  const pm25 = aqiData.pm25;

  let text = "";
  let suggestedFollowUps: string[] = [];

  if (q.includes("play") || q.includes("kid") || q.includes("child") || q.includes("बच्‍चे") || q.includes("खेल")) {
    if (isHi) {
      text = `वर्तमान में AQI **${aqi}** (${pm25} µg/m³ PM2.5) है, जो बच्चों के लिए अत्यधिक हानिकारक है।\n\n` +
        `**निर्णय:** आज बच्चों को बाहर खेलने की अनुमति बिल्कुल **न दें**। बच्चों के फेफड़े अभी विकसित हो रहे होते हैं और वे वयस्कों की तुलना में प्रति किलोग्राम शरीर के वजन पर 50% अधिक हवा सांस में लेते हैं।\n\n` +
        `**सुरक्षित विकल्प:** कमरे के अंदर बोर्ड गेम, पेंटिंग या इनडोर व्यायाम करवाएं। यदि बाहर जाना अपरिहार्य हो, तो अच्छी फिटिंग वाला बाल-अनुकूल मास्क पहनाएं।`;
      suggestedFollowUps = [
        "घर के अंदर हवा कैसे साफ रखें?",
        "बच्चों के लिए कौन सा मास्क सबसे अच्छा है?",
        "खिड़की कब खोलना सुरक्षित रहेगा?"
      ];
    } else {
      text = `Current AQI is **${aqi}** (PM2.5: **${pm25} µg/m³**), placing it squarely in the ${aqiData.category} range.\n\n` +
        `**Guidance for Children:** Outdoor play or sports periods must be **cancelled today**. Children inhale approximately 50% more air per kg of body weight than adults, and particulate penetrates deeper into developing alveolar sacs.\n\n` +
        `**Actionable Alternative:** Transition to indoor creative play or quiet activities in a filtered room. If stepping outdoors briefly, ensure an age-appropriate fitted N95/KN95 respirator is worn.`;
      suggestedFollowUps = [
        "What is the cheapest DIY purifier I can make?",
        "When is the safest time to ventilate today?",
        "Does wearing a surgical mask protect against smog?"
      ];
    }
  } else if (q.includes("window") || q.includes("ventilate") || q.includes("खिड़की") || q.includes("हवा")) {
    if (isHi) {
      text = `सर्दियों में तापमान व्युत्क्रमण (Temperature Inversion) के कारण सुबह के समय जमीन पर भयंकर प्रदूषण फंसा रहता है।\n\n` +
        `**सुरक्षित समय:** खिड़की खोलने का सबसे सुरक्षित समय दोपहर **01:30 PM से 03:30 PM** के बीच है, जब धूप निकलने से धुआं ऊपर उठता है।\n\n` +
        `**नियम:** खिड़कियों को केवल 15 से 20 मिनट के लिए खोलें, फिर तुरंत बंद करके प्यूरीफायर ऑन कर दें। सुबह 6 से 11 बजे खिड़कियां बंद रखें।`;
      suggestedFollowUps = [
        "सस्ते में दरवाजे और खिड़कियां कैसे सील करें?",
        "क्या पौधे घर की हवा साफ कर सकते हैं?",
        "कमरे के लिए सही प्यूरीफायर साइज क्या है?"
      ];
    } else {
      text = `Winter smog is governed by nocturnal ground cooling creating a temperature inversion layer that traps particulates near street level.\n\n` +
        `**Optimal Window:** Today's safest window for home ventilation is **between 1:30 PM and 3:30 PM**, when solar heating expands the boundary layer.\n\n` +
        `**Protocol:** Perform a rapid 15-20 minute cross-ventilation flush to replace stale CO2, then tightly reseal windows and run your HEPA or Corsi-Rosenthal filter. Keep windows firmly closed between 10:00 PM and 11:00 AM.`;
      suggestedFollowUps = [
        "How do I seal drafty window gaps cheaply?",
        "Is an air purifier necessary if windows are closed?",
        "Can my toddler go outdoors this afternoon?"
      ];
    }
  } else if (q.includes("purifier") || q.includes("cheap") || q.includes("box fan") || q.includes("corsi") || q.includes("सस्ता") || q.includes("प्यूरीफायर")) {
    if (isHi) {
      text = `यदि आपका बजट सीमित है, तो ₹15,000 का महंगा ब्रांडेड प्यूरीफायर खरीदने की कोई आवश्यकता नहीं है।\n\n` +
        `**देसी समाधान (Corsi-Rosenthal Box Fan):**\n` +
        `1. एक 20-इंच का बॉक्स पंखा (~₹1,800) लें।\n` +
        `2. 4 पीस MERV 13 या HEPA-ग्रेड फर्नेस फिल्टर (~₹1,800) और डक्ट टेप (~₹150) लें।\n` +
        `3. पंखे के पीछे फिल्टरों का बॉक्स बनाएं और टेप से सील कर दें।\n\n` +
        `यह कुल ₹3,500 में 250+ CADR (स्वच्छ हवा की गति) प्रदान करता है, जो बड़े ब्रांड्स के बराबर या बेहतर है।`;
      suggestedFollowUps = [
        "CR बॉक्स बनाने का पूरा तरीका दिखाएं",
        "MERV 13 फिल्टर कहां से खरीदें?",
        "गीला पोछा लगाने से कितना प्रदूषण कम होता है?"
      ];
    } else {
      text = `You do not need to spend ₹12,000–₹20,000 on imported commercial purifiers to achieve hospital-grade air cleaning.\n\n` +
        `**The Corsi-Rosenthal (CR) Box Solution:**\n` +
        `- **Materials:** 1 standard 20-inch box fan (~₹1,800), 4 MERV 13 pleated air filters (~₹1,800 total), 1 roll duct tape (~₹150), and cardboard.\n` +
        `- **Performance:** Delivers **250 to 350 CFM clean air delivery rate (CADR)**—matching or beating commercial units costing 4x more.\n` +
        `- **Cardboard Shroud Tip:** Cut a 14-inch circular shroud on the front face of the fan to stop blade edge vortex backflow.`;
      suggestedFollowUps = [
        "Show me the step-by-step CR Box build guide",
        "How many air changes per hour do I need for my room?",
        "Do houseplants clean PM2.5 smog?"
      ];
    }
  } else {
    // General grounded answer
    if (isHi) {
      text = `वर्तमान AQI **${aqi}** (${aqiData.category}) है और PM2.5 स्तर **${pm25} µg/m³** है।\n\n` +
        `**मुख्य दिशानिर्देश:**\n` +
        `1. बाहर जाते समय केवल N95 या FFP2 मास्क का उपयोग करें; कपड़े का मास्क PM2.5 नहीं रोकता।\n` +
        `2. घर के अंदर झाड़ू लगाने के बजाय गीला पोछा लगाएं ताकि महीन कण हवा में न उड़ें।\n` +
        `3. खिड़कियां दोपहर 1:30 से 3:30 के बीच ही खोलें।\n\n` +
        `*नोट: यदि परिवार में किसी को सांस लेने में तीव्र कठिनाई हो, तो तत्काल डॉक्टर से संपर्क करें।*`;
      suggestedFollowUps = [
        "क्या आज बच्चे बाहर खेल सकते हैं?",
        "सस्ता देसी प्यूरीफायर कैसे बनाएं?",
        "सिगरेट के समतुल्य नुकसान की गणना कैसे हुई?"
      ];
    } else {
      text = `Grounded in your location (${profile.locationName}) with current AQI **${aqi}** (${aqiData.category}) and PM2.5 at **${pm25} µg/m³**:\n\n` +
        `**Key Actions for Today:**\n` +
        `1. **Respiratory Protection:** Wear a certified N95 respirator if stepping out. Standard cloth masks block under 20% of PM2.5.\n` +
        `2. **Indoor Dust Control:** Use damp wet-mopping rather than dry sweeping to capture settled particulate without resuspension.\n` +
        `3. **Ventilation:** Keep boundary openings sealed except during peak solar mixing between 1:30 PM and 3:30 PM.\n\n` +
        `*Safety note: SmogShield provides exposure reduction guidance, not clinical diagnoses. If experiencing chest pain or wheezing, contact a physician immediately.*`;
      suggestedFollowUps = [
        "Can my kid play outside today?",
        "When is it safe to open windows?",
        "How do I build a Corsi-Rosenthal box fan?"
      ];
    }
  }

  return {
    text,
    citations: retrieved.map(r => r.source),
    suggestedFollowUps
  };
}

/**
 * Gemini API calling helper (REST endpoint)
 */
async function callGeminiPlan(
  apiKey: string,
  profile: UserProfile,
  aqiData: AQIData,
  language: 'en' | 'hi'
): Promise<DailyCleanAirPlan | null> {
  const prompt = `Generate a structured Daily Clean Air Plan for this user:
Profile: ${JSON.stringify(profile)}
AQI Data: ${JSON.stringify(aqiData)}
Language requested: ${language}

Strict requirements:
- Return ONLY valid JSON adhering to this structure:
{
  "id": "plan_123",
  "date": "string",
  "headline": "string",
  "generalAdvice": "string",
  "maskRecommendation": { "recommended": boolean, "type": "string", "when": "string", "fitTip": "string" },
  "blocks": [
    { "id": "b1", "title": "string", "timeRange": "string", "period": "morning|commute|outdoor|indoor|evening|sleep", "action": "string", "why": "string", "impact": { "pm25AvoidedUg": number, "cigarettesAvoided": number, "co2eSavedKg": number, "moneySavedInr": number } }
  ],
  "childrenOutdoorAdvice": "string",
  "ventilationStrategy": "string",
  "citations": ["string"]
}`;

  const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.8-flash', 'gemma-4-26b-a4b-it'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed && parsed.headline && parsed.blocks) {
            return parsed as DailyCleanAirPlan;
          }
        }
      }
    } catch {
      // try next model
    }
  }

  return null;
}

async function callGeminiChat(
  apiKey: string,
  query: string,
  history: ChatMessage[],
  profile: UserProfile,
  aqiData: AQIData,
  retrieved: KnowledgeChunk[],
  language: 'en' | 'hi'
) {
  const context = `Location: ${profile.locationName}, Current AQI: ${aqiData.aqi} (${aqiData.category}), PM2.5: ${aqiData.pm25} ug/m3.
Retrieved knowledge:
${retrieved.map(r => `- ${r.title}: ${r.content}`).join("\n")}
Language: ${language}`;

  const prompt = `${context}\n\nUser Question: ${query}\n\nProvide an empathetic, scientifically grounded reply in 2-3 short paragraphs with citations. Then list 3 suggested follow-up questions at the end under [FOLLOW_UPS] formatted as a JSON string array.`;

  const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.8-flash', 'gemma-4-26b-a4b-it'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (res.ok) {
        const json = await res.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          let text = rawText;
          let suggestedFollowUps = [
            "What is the cheapest DIY purifier I can make?",
            "When is the safest time to ventilate today?",
            "Does wearing a surgical mask protect against smog?"
          ];

          if (rawText.includes("[FOLLOW_UPS]")) {
            const parts = rawText.split("[FOLLOW_UPS]");
            text = parts[0].trim();
            try {
              suggestedFollowUps = JSON.parse(parts[1].trim());
            } catch {
              // fallback
            }
          }

          return {
            text,
            citations: retrieved.map(r => r.source),
            suggestedFollowUps
          };
        }
      }
    } catch {
      // try next model
    }
  }

  return null;
}
