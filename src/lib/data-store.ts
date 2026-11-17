import { IndoorHack, SustainableSwap, CommunityGroup } from "@/types";

export const INDOOR_HACKS: IndoorHack[] = [
  {
    id: "hack_cr_box",
    title: "Corsi-Rosenthal Box Fan Purifier (DIY)",
    category: "diy_purifier",
    costEstimateInr: 3500,
    difficulty: "Moderate",
    reductionPotentialPercent: 85,
    description: "Hospital-grade air cleaning for 1/4th the price of commercial units. Built from 1 box fan, 4 MERV 13 filters, and cardboard.",
    materials: [
      "1x 20-inch box fan (₹1,600 - ₹1,800)",
      "4x 20x20x1 or 20x20x2 MERV 13 / F7 furnace filters (₹1,600 total)",
      "1x Roll heavy-duty duct tape (₹120)",
      "Cardboard sheet for bottom base and top circular shroud"
    ],
    steps: [
      "Arrange the 4 filters into a cube, ensuring arrows point INWARD toward the center.",
      "Tape all vertical corners firmly with duct tape to make airtight seams.",
      "Tape a square piece of cardboard to the bottom to seal the base.",
      "Place the box fan on top, blowing UPWARD and OUTWARD.",
      "Cut a circular cardboard shroud with a 14-inch opening and tape to the fan face to eliminate blade vortex backflow (boosts efficiency by 25%)."
    ]
  },
  {
    id: "hack_wet_mop",
    title: "Microfiber Wet-Mopping (Never Dry Sweep)",
    category: "cleaning",
    costEstimateInr: 0,
    difficulty: "Easy",
    reductionPotentialPercent: 45,
    description: "Dry brooms and sweeping kick fine particulate (PM2.5) back into the air. Damp microfiber mopping physically traps particles on contact.",
    steps: [
      "Dampen a microfiber mop or cotton cloth with clean water.",
      "Mop slowly across floors, wiping inward from room edges.",
      "Rinse mop head frequently in a bucket away from living quarters.",
      "Perform twice daily during severe smog episodes."
    ]
  },
  {
    id: "hack_gap_sealing",
    title: "Draft & Door Gap Weatherstripping",
    category: "sealing",
    costEstimateInr: 250,
    difficulty: "Easy",
    reductionPotentialPercent: 40,
    description: "Unsealed gaps under main doors and window sashes allow heavy toxic outdoor air to constantly infiltrate indoor rooms.",
    materials: [
      "Self-adhesive silicone door bottom strip or foam weatherstrip (₹200 on local hardware / online)",
      "Rolled cotton bath towels (zero cost interim fix)"
    ],
    steps: [
      "Clean door threshold thoroughly with a dry cloth.",
      "Affix silicone weatherstrip along the bottom edge of exterior doors.",
      "For sliding windows, place foam insulation strips along the center meeting rail.",
      "Roll a heavy towel and firmly wedge it across the bottom gap of doors leading to balconies."
    ]
  },
  {
    id: "hack_kitchen_vent",
    title: "Cooking Exhaust & Closed-Door Protocol",
    category: "ventilation",
    costEstimateInr: 0,
    difficulty: "Easy",
    reductionPotentialPercent: 65,
    description: "Frying, tadka, and gas burners generate severe indoor PM2.5 spikes (>300 µg/m³). Segregating the kitchen prevents pollution spread.",
    steps: [
      "Always shut kitchen doors leading into bedrooms and living rooms before igniting gas burners.",
      "Turn on exhaust fan or kitchen hood 1 minute BEFORE cooking begins.",
      "Keep pots and pans covered with lids whenever simmering or boiling.",
      "Let exhaust fan run for 10 minutes AFTER cooking has finished."
    ]
  },
  {
    id: "hack_plants_myth",
    title: "Houseplants vs Smog: Science vs Myth",
    category: "plants_facts",
    costEstimateInr: 0,
    difficulty: "Easy",
    reductionPotentialPercent: 0,
    description: "Widespread belief says snake plants and areca palms clean winter smog. Peer-reviewed environmental physics proves otherwise.",
    mythVsFact: {
      myth: "Keeping 4-5 houseplants will purify PM2.5 smog from your bedroom air like a machine.",
      fact: "Plants do not filter particulate matter (PM2.5). In real-world ventilated rooms, you would need between 10 to 100 plants per square meter to match a basic filter. Enjoy plants for aesthetics and humidity, but never substitute them for an air filter or sealed windows."
    },
    steps: [
      "Do not rely on plants as an alternative to an air purifier or mask.",
      "Wipe indoor plant leaves with a damp cloth weekly to remove settled dust.",
      "Ensure potted soil doesn't remain overwatered to avoid indoor mold spore buildup."
    ]
  }
];

export const SUSTAINABLE_SWAPS: SustainableSwap[] = [
  {
    id: "swap_metro_commute",
    category: "commute",
    title: "Switch Peak Commute from Solo Car/Cab to Metro",
    fromAction: "Driving solo petrol car in rush-hour traffic gridlock",
    toAction: "Taking Metro rail with rapid last-mile walking / e-rickshaw",
    costDifferenceInr: "Saves ~₹3,500/month",
    effort: "Medium",
    feasibilityScore: 88,
    co2eMonthlyKg: 68,
    pmMonthlyGrams: 35,
    healthBenefit: "Cuts toxic road-tunnel particulate inhalation by 75%; saves 40 mins of traffic stress.",
    rationale: "Vehicular exhaust is concentrated at bumper level. Underground and elevated trains have filtered station air and generate zero tailpipe emissions."
  },
  {
    id: "swap_two_wheeler_n95",
    category: "commute",
    title: "Two-Wheeler Commuter N95 & Off-Peak Shift",
    fromAction: "Riding open motorcycle in traffic with simple cloth bandana or no mask",
    toAction: "Headband N95 respirator under full-face helmet + shift departure by 30 mins",
    costDifferenceInr: "Costs ₹150 for reusable N95 pack",
    effort: "Low",
    feasibilityScore: 94,
    co2eMonthlyKg: 12,
    pmMonthlyGrams: 18,
    healthBenefit: "Blocks 95% of direct diesel exhaust soot; stops acute bronchial burning.",
    rationale: "Two-wheeler riders are at the highest exposure tier in urban smog. A sealed N95 eliminates 18-24 cigarettes worth of daily PM2.5 inhalation."
  },
  {
    id: "swap_clean_heating",
    category: "heating",
    title: "Electric Radiant Heating instead of Angithi / Charcoal",
    fromAction: "Burning coal, firewood, or scrap wood in indoor angithi brazier",
    toAction: "Using 1000W-1500W electric oil-filled or quartz heater + warm blankets",
    costDifferenceInr: "₹40-₹60/night electricity",
    effort: "Low",
    feasibilityScore: 82,
    co2eMonthlyKg: 140,
    pmMonthlyGrams: 3600,
    healthBenefit: "Eliminates deadly carbon monoxide (CO) and severe indoor smoke (1,200 µg/m³).",
    rationale: "Unvented biomass burning causes catastrophic indoor pollution and severe nocturnal hypoxia for sleeping families."
  },
  {
    id: "swap_zero_waste_burning",
    category: "waste",
    title: "Mulching & Composting Dry Garden Leaves",
    fromAction: "Sweeping and burning dry fallen leaves and municipal curb waste",
    toAction: "Shredding and burying leaves into soil compost pit or RWA organic bin",
    costDifferenceInr: "Free (saves municipal penalties)",
    effort: "Low",
    feasibilityScore: 90,
    co2eMonthlyKg: 42,
    pmMonthlyGrams: 260,
    healthBenefit: "Prevents toxic dioxins, furans, and black smoke from engulfing the immediate neighbourhood.",
    rationale: "1 pile of burning leaves emits more particulate than 2 hours of heavy truck exhaust right at breathing height."
  },
  {
    id: "swap_induction_cooking",
    category: "cooking",
    title: "Transition High-Simmer Cooking to Portable Induction",
    fromAction: "Cooking unvented on open LPG burner for multiple hours",
    toAction: "Using single countertop induction cooktop (₹1,800)",
    costDifferenceInr: "Saves ~₹250/month in LPG refills",
    effort: "Low",
    feasibilityScore: 85,
    co2eMonthlyKg: 28,
    pmMonthlyGrams: 45,
    healthBenefit: "Eliminates kitchen nitrogen dioxide (NO2) combustion fumes that trigger childhood asthma.",
    rationale: "Induction cooktops have 85% thermal efficiency vs 40% for gas burners and produce zero indoor combustion byproducts."
  }
];

export const DEMO_COMMUNITY_GROUP: CommunityGroup = {
  id: "comm_delhi_rwa_sec14",
  name: "Green Shutter Community (Block B & C)",
  type: "neighborhood",
  memberCount: 142,
  currentChallenge: {
    title: "7-Day Zero Open Burning & Metro Commute Challenge",
    description: "Collective neighbourhood pact to report open leaf burning, carpool/take transit, and seal drafty common doors.",
    targetActions: 500,
    completedActions: 368,
    co2AvoidedKg: 785,
    pmAvoidedGrams: 14200,
    daysLeft: 3
  },
  leaderboard: [
    { rank: 1, name: "EcoPioneer_Tower4", score: 840, actionsDone: 19 },
    { rank: 2, name: "CleanAirMom_B12", score: 790, actionsDone: 17 },
    { rank: 3, name: "MetroRider_Kabir", score: 710, actionsDone: 16 },
    { rank: 4, name: "GreenBalcony_Ramesh", score: 650, actionsDone: 14 },
    { rank: 5, name: "Sector14_SchoolLeader", score: 620, actionsDone: 13 }
  ]
};
