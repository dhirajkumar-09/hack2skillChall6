import { AppLanguage } from "@/types";

export const TRANSLATIONS = {
  en: {
    appName: "SmogShield",
    appTagline: "Clean-Air Navigator for Urban Smog",
    demoBadge: "Demo Mode Active (Zero Keys Required)",
    switchLanguage: "हिंदी में बदलें",
    nav: {
      dashboard: "Dashboard",
      plan: "Today's Plan",
      indoor: "Indoor Hub",
      swaps: "Swaps",
      impact: "Impact",
      chat: "AI Chat",
      community: "Community",
      profile: "Profile"
    },
    aqi: {
      title: "Live Air Quality",
      good: "Good",
      moderate: "Moderate",
      sensitive: "Unhealthy for Sensitive",
      unhealthy: "Unhealthy",
      veryUnhealthy: "Very Unhealthy",
      hazardous: "Hazardous / Severe+",
      primaryPollutant: "Primary Pollutant",
      forecast48h: "24-48h AQI Forecast",
      safeWindows: "Optimal Ventilation & Outdoor Windows",
      weatherInversionNotice: "Temperature Inversion Detected: Cold surface air trapping pollutants near ground level. Avoid morning outdoor exercise."
    },
    plan: {
      title: "Today's Clean-Air Plan",
      subtitle: "Personalized routine tuned to current AQI & your household profile",
      markDone: "Mark Complete",
      done: "Done",
      maskTitle: "Mask Protocol",
      outdoorPlayTitle: "Children Outdoor Play Guidance",
      ventilationTitle: "Home Ventilation Window"
    },
    indoor: {
      title: "Indoor Air Quality Hub",
      subtitle: "Low-cost hacks, Corsi-Rosenthal DIY purifier, and CADR room sizing",
      crBoxBuilder: "Corsi-Rosenthal Box Fan Calculator",
      hacksTitle: "High-Impact, Low-Cost Interventions",
      sensorTitle: "Manual Indoor Air Sensor Log"
    },
    swaps: {
      title: "Sustainable Alternatives Engine",
      subtitle: "Actionable low-emission swaps tailored to your budget and commute",
      feasibility: "Feasibility for You",
      effort: "Effort",
      healthBenefit: "Health Protection"
    },
    impact: {
      title: "Health & Emissions Impact Explainer",
      subtitle: "Traceable formulas and assumptions behind every number",
      pmReduced: "Inhaled PM2.5 Avoided",
      cigsAvoided: "Cigarette Equivalent Avoided",
      co2Saved: "CO2e Emissions Prevented",
      moneySaved: "Money Saved",
      expandFormula: "How we calculated this",
      medicalDisclaimer: "Estimates are for risk-reduction and educational framing only, not medical diagnosis. Inhalation rates vary by individual activity."
    },
    chat: {
      title: "Clean-Air AI Assistant",
      subtitle: "Ask about safety, window timing, purifier setups, or school commutes",
      placeholder: "e.g., Can my 3-year-old play outside at 5 PM?",
      send: "Send",
      groundedBadge: "Grounded in Live AQI & WHO Guidelines",
      listening: "Listening...",
      speak: "Voice Input"
    },
    community: {
      title: "Community & RWA Action Hub",
      subtitle: "Group challenges, collective impact, and WhatsApp awareness posters",
      sharePoster: "Generate WhatsApp Poster",
      leaderboard: "Neighbourhood Leaderboard",
      activeChallenge: "Current Group Challenge"
    },
    profile: {
      title: "Household & Lifestyle Profile",
      personaSwitcher: "Quick Switch Demo Persona",
      householdMembers: "Household Members & Health Risks",
      homeCharacteristics: "Home & Ventilation",
      commuteInfo: "Commute & Energy"
    }
  },
  hi: {
    appName: "स्मॉगशील्ड",
    appTagline: "सर्दियों के प्रदूषण से बचाव का AI सहायक",
    demoBadge: "डेमो मोड सक्रिय (बिना किसी API कुंजी के)",
    switchLanguage: "Switch to English",
    nav: {
      dashboard: "डैशबोर्ड",
      plan: "आज की योजना",
      indoor: "घर की हवा",
      swaps: "स्वच्छ विकल्प",
      impact: "स्वास्थ्य प्रभाव",
      chat: "AI चैट",
      community: "समुदाय",
      profile: "प्रोफ़ाइल"
    },
    aqi: {
      title: "वर्तमान वायु गुणवत्ता",
      good: "अच्छा",
      moderate: "मध्यम",
      sensitive: "संवेदनशील वर्ग के लिए अस्वस्थ",
      unhealthy: "अस्वस्थ",
      veryUnhealthy: "अत्यधिक अस्वस्थ",
      hazardous: "अति गंभीर / खतरनाक",
      primaryPollutant: "मुख्य प्रदूषक",
      forecast48h: "अगले 24-48 घंटों का पूर्वानुमान",
      safeWindows: "खिड़की खोलने और बाहर निकलने का सुरक्षित समय",
      weatherInversionNotice: "तापमान व्युत्क्रमण (Inversion) चेतावनी: ठंडी हवा जमीन पर प्रदूषण रोक रही है। सुबह बाहर व्यायाम न करें।"
    },
    plan: {
      title: "आज की स्वच्छ-वायु योजना",
      subtitle: "वर्तमान AQI और आपके परिवार के स्वास्थ्य के अनुसार व्यक्तिगत दिनचर्या",
      markDone: "पूरा चिह्नित करें",
      done: "पूर्ण",
      maskTitle: "मास्क नियम",
      outdoorPlayTitle: "बच्चों के खेलने की सलाह",
      ventilationTitle: "घर में ताजी हवा लाने का समय"
    },
    indoor: {
      title: "घर के अंदर वायु गुणवत्ता हब",
      subtitle: "सस्ते उपाय, देसी एयर प्यूरीफायर (CR बॉक्स) और कमरे का आकार कैलकुलेटर",
      crBoxBuilder: "सस्ता देसी एयर प्यूरीफायर (Corsi-Rosenthal) गाइड",
      hacksTitle: "कम लागत वाले असरदार उपाय",
      sensorTitle: "घर के सेंसर की रीडिंग दर्ज करें"
    },
    swaps: {
      title: "स्वच्छ और टिकाऊ विकल्प",
      subtitle: "आपके बजट और यात्रा के अनुकूल प्रदूषण घटाने वाले विकल्प",
      feasibility: "आपके लिए सुलभता",
      effort: "प्रयास",
      healthBenefit: "स्वास्थ्य लाभ"
    },
    impact: {
      title: "स्वास्थ्य एवं उत्सर्जन प्रभाव कैलकुलेटर",
      subtitle: "हर आंकड़े के पीछे के वैज्ञानिक सूत्र और स्पष्ट गणना",
      pmReduced: "फेफड़ों में जाने से बचा PM2.5",
      cigsAvoided: "सिगरेट के बराबर नुकसान से बचाव",
      co2Saved: "कम हुआ कार्बन उत्सर्जन (CO2e)",
      moneySaved: "बचत",
      expandFormula: "हमने यह गणना कैसे की",
      medicalDisclaimer: "यह अनुमान केवल जोखिम कम करने और जागरूकता के लिए है, चिकित्सा सलाह नहीं है।"
    },
    chat: {
      title: "स्वच्छ-वायु AI सहायक",
      subtitle: "पूछें: क्या बच्चे बाहर खेल सकते हैं? खिड़कियां कब खोलें? सस्ता प्यूरीफायर कैसे बनाएं?",
      placeholder: "उदा. क्या शाम 5 बजे मेरे 3 साल के बच्चे का बाहर जाना सुरक्षित है?",
      send: "भेजें",
      groundedBadge: "वर्तमान AQI और WHO मानकों पर आधारित",
      listening: "सुन रहे हैं...",
      speak: "बोलें"
    },
    community: {
      title: "समुदाय और RWA हब",
      subtitle: "सामूहिक चुनौतियां, कुल प्रभाव और WhatsApp जागरूकता पोस्टर",
      sharePoster: "WhatsApp पोस्टर बनाएं",
      leaderboard: "मोहल्ला लीडरबोर्ड",
      activeChallenge: "सामूहिक चुनौती"
    },
    profile: {
      title: "परिवार और जीवनशैली प्रोफ़ाइल",
      personaSwitcher: "डेमो व्यक्ति बदलें",
      householdMembers: "परिवार के सदस्य और स्वास्थ्य संवेदनशीलता",
      homeCharacteristics: "घर और वेंटिलेशन",
      commuteInfo: "यात्रा और ऊर्जा स्रोत"
    }
  }
};

export function getTranslation(lang: AppLanguage = 'en') {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
