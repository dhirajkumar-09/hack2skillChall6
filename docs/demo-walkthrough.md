# SmogShield: 2-Minute Demo Script & Walkthrough

This script provides an exact 2-minute demonstration flow to showcase SmogShield's full-stack and GenAI capabilities for judges, users, and community stakeholders.

---

## ⏱️ Walkthrough Schedule (120 Seconds)

### 0:00 – 0:25: Onboarding & Persona Switching (Dashboard `/`)
1. **Open the App:** Navigate to `http://localhost:3000`. Point out the mobile-first Progressive Web App shell with offline caching and clean air dark mode theme.
2. **Observe Live AQI & Ground Inversion:** 
   - Point out the real-time AQI Gauge (AQI 382 "Hazardous", PM2.5 236 µg/m³).
   - Highlight the **Atmospheric Inversion Alert Banner** explaining how cold winter nocturnal ground cooling traps vehicle soot and smoke in the surface boundary layer.
3. **1-Click Persona Switching:**
   - Tap **"Sharma Family"** (Toddler Aarav + Asthmatic Grandparent Ramesh). Notice the Member Vulnerability breakdown immediately recalculating:
     - *Aarav (Age 3):* Inhales ~857 µg PM2.5/day ($\sim 2.6$ cigarettes equivalent).
     - *Ramesh (Age 68):* Inhales ~1102 µg PM2.5/day ($\sim 3.3$ cigarettes equivalent) with specific asthma caution.
   - Tap **"Kabir"** (Daily Two-Wheeler Commuter). Notice how the profile immediately re-calibrates for 50-minute on-road exhaust exposure.

### 0:25 – 0:50: GenAI Daily Plan (`/plan`)
1. **Navigate to Today's Plan:** Click the "Plan" tab in the bottom bar.
2. **Review Time-Blocked Routine:**
   - *Morning (06:30 - 08:30):* Boundary inversion trap mitigation; wet-mopping protocol.
   - *Commute (08:30 - 09:45):* Certified N95 headband mask protocol under helmet or switching to Metro rail.
   - *Afternoon (13:30 - 15:30):* Optimal solar peak ventilation window.
   - *Evening (18:00 - 20:30):* Kitchen exhaust & door gap sealing.
   - *Sleep (22:00 - 06:00):* Clean sleep sanctuary with active filtration.
3. **Interactive Habit Check-In:**
   - Tap **"Mark Complete"** on the Morning block. Watch the button change to `"✓ Done"`, and note the live reduction tally update.

### 0:50 – 1:15: Indoor Air Quality Hub & CR Box Builder (`/indoor`)
1. **Corsi-Rosenthal Box Purifier Calculator:**
   - Show the interactive room dimension sliders ($14\ \text{ft} \times 12\ \text{ft}$, $9\ \text{ft}$ ceiling).
   - Point out the calculated room volume ($1,512\ \text{cu ft}$) and Clean Air Delivery Rate ($\text{CADR} \sim 260\ \text{CFM}$) achieving **$10.3\ \text{Air Changes per Hour (ACH)}$** ("Sufficient").
   - Highlight the cost comparison bar: **DIY CR Box (₹3,500)** vs **Commercial HEPA (₹14,500)**, saving **₹11,000**.
2. **4-Step Assembly Blueprint:**
   - Click "Next" through the steps, highlighting the critical **14-inch circular cardboard shroud** on the fan face that eliminates blade-tip vortex backflow.
3. **Debunking Myths:**
   - Show the "Houseplants vs Smog" myth-busting card, explaining peer-reviewed environmental physics (why 5 houseplants do not clean PM2.5).

### 1:15 – 1:35: Impact Explainer with Traceable Formulas (`/impact`)
1. **4 Impact Metrics:**
   - Point out: Inhaled PM2.5 Avoided ($710\ \mu\text{g}$), Cigarettes Equiv Avoided ($2.2$), $\text{CO}_2\text{e}$ Prevented ($1.8\ \text{kg}$), and Money Saved ($₹45$).
2. **Expand "How We Calculated This":**
   - Click to expand the accordion.
   - Show the explicit mathematical formula:
     $$\text{Cigarette Equiv} = \left(\frac{\text{PM}_{2.5}}{22\ \mu\text{g}/\text{m}^3}\right) \times \left(\frac{\text{Hours}}{24}\right)$$
   - Point out the peer-reviewed scientific citations (**Berkeley Earth 2015**, **U.S. EPA Exposure Factors Handbook 2011**, **WHO 2021**).
   - Point out the transparent non-diagnostic public health disclaimer.

### 1:35 – 1:50: Grounded AI Assistant (`/chat`)
1. **Ask a Grounded Question:**
   - Tap the suggested chip: *"Can my kid play outside today?"*
   - Watch the assistant respond in real time, citing the live AQI ($382$), explaining that children inhale 50% more air per kg body weight, and recommending indoor creative play.
2. **Citations:**
   - Point out the grounded citations pill citing WHO 2021 guidelines and CPCB emergency standards.

### 1:50 – 2:00: Community Action & Bilingual Localization (`/community`)
1. **Community Challenge:** Show the "7-Day Zero Open Burning & Metro Commute Challenge" (74% progress, $785\ \text{kg}\ \text{CO}_2$ avoided).
2. **WhatsApp Poster Generator:**
   - Click **"Copy WhatsApp Text"** $\to$ observe the instant `"Copied!"` confirmation with pre-formatted bullet points for apartment/school WhatsApp groups.
   - Click **"Download PNG Poster"** $\to$ generates high-contrast awareness graphic via HTML5 canvas.
3. **Bilingual Toggle:**
   - Tap the **"हिन्दी"** button in the top header.
   - Observe the entire application instantly translating into clear Hindi (डैशबोर्ड, आज की योजना, घर की हवा, स्वच्छ विकल्प, स्वास्थ्य प्रभाव, AI चैट, समुदाय).
