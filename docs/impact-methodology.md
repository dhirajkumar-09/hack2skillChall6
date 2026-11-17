# SmogShield: Impact Calculation Methodology & Scientific Sources

This document details the exact mathematical formulas, physical parameters, underlying assumptions, and peer-reviewed scientific citations used throughout the **SmogShield** clean-air assistant and impact explainer.

---

## 1. Principle of Separation of Concerns

SmogShield enforces a strict separation between deterministic computations and generative natural language processing:
- **Deterministic Engine (`src/lib/impact-engine.ts`):** Calculates PM2.5 inhalation mass, Berkeley Earth cigarette equivalency, room ACH, CADR adequacy, and carbon emissions. The LLM is **never** permitted to hallucinate or invent mathematical or exposure metrics.
- **Generative AI Layer (`src/lib/llm-provider.ts`):** Ingests verified numerical calculations, combining them with retrieved scientific knowledge base chunks to personalize communication, adapt language (English and Hindi), and render clear guidance cards.

---

## 2. Inhaled PM2.5 Exposure Modeling

### 2.1 Formula
$$\text{Inhaled PM}_{2.5}\ (\mu\text{g}) = \sum_{i \in \{\text{indoor, outdoor}\}} \left[ V_i \times T_i \times C_i \times (1 - \eta_i) \right]$$

Where:
- $V_i$: Inhalation / ventilation rate in cubic meters per hour ($\text{m}^3/\text{h}$).
- $T_i$: Time spent in the respective environment (hours).
- $C_i$: Particulate concentration ($\mu\text{g}/\text{m}^3$).
- $\eta_i$: Protection efficiency of respiratory barrier or room filtration ($0.0 \le \eta \le 1.0$).

### 2.2 Ventilation Rates by Age and Activity
Derived from the **U.S. EPA Exposure Factors Handbook (2011)** and **WHO Air Quality Guidelines**:

| Member Role | Age Range | Resting Breathing Rate ($V_{\text{rest}}$) | Active / Commuting Rate ($V_{\text{active}}$) | Notes |
|---|---|---|---|---|
| **Toddler** | 0 – 4 | $0.35\ \text{m}^3/\text{h}$ | $0.70\ \text{m}^3/\text{h}$ | Inhales 50% more air per kg body mass than adults |
| **Child** | 5 – 12 | $0.50\ \text{m}^3/\text{h}$ | $1.00\ \text{m}^3/\text{h}$ | Higher respiratory rate; lung alveoli developing |
| **Adult** | 13 – 64 | $0.55\ \text{m}^3/\text{h}$ | $1.25\ \text{m}^3/\text{h}$ | EPA adult standard reference |
| **Senior** | 65+ | $0.45\ \text{m}^3/\text{h}$ | $0.90\ \text{m}^3/\text{h}$ | Lower tidal volume; higher cardiovascular vulnerability |

### 2.3 Barrier Efficiencies ($\eta$)
- **Certified N95 / FFP2 Respirator (snug seal):** $\eta = 0.95$ (95% reduction across $0.3\ \mu\text{m}$ aerosol test).
- **Surgical Mask:** $\eta = 0.38$ (38% reduction due to peripheral facial leakage).
- **Cloth Bandana / Scarf:** $\eta = 0.18$ (18% reduction; ineffective against fine PM2.5).
- **Room HEPA / Corsi-Rosenthal Fan:** $\eta_{\text{indoor}} = 0.85$ (continuous filtration in sealed room).
- **Unfiltered Indoor Infiltration:**
  - Sealed double-glazed envelope: $\text{I/O Ratio} \approx 0.35 - 0.45$
  - Drafty / Natural ventilation: $\text{I/O Ratio} \approx 0.65 - 0.75$

---

## 3. Berkeley Earth Cigarette Equivalence Model

### 3.1 Background & Formula
To convey the physiological burden of severe particulate smog in accessible terms, SmogShield adopts the mathematical formulation established by **Muller, Muller & Rohde (Berkeley Earth, 2015)**:

$$\text{Cigarette Equivalent} = \left( \frac{\text{PM}_{2.5}\ \text{in}\ \mu\text{g}/\text{m}^3}{22\ \mu\text{g}/\text{m}^3} \right) \times \left( \frac{\text{Exposure Hours}}{24\ \text{hours}} \right)$$

For cumulative inhaled mass:
$$\text{Cigarettes Avoided} = \frac{\Delta\text{Inhaled PM}_{2.5}\ (\mu\text{g})}{330\ \mu\text{g}}$$

*(Assuming average daily adult inhaled volume of $\sim 15\ \text{m}^3 \times 22\ \mu\text{g}/\text{m}^3 \approx 330\ \mu\text{g}$ per cigarette equivalent).*

### 3.2 Critical Ethical & Public Health Framing Notice
> [!IMPORTANT]
> **Limitations of the Cigarette Analogy:**
> 1. **Statistical Mortality Proxy:** This metric translates epidemiological risk of all-cause and cardiopulmonary mortality. It does **NOT** indicate that urban smog is biochemically identical to burning tobacco.
> 2. **Chemical Constituents:** While ambient PM2.5 contains polycyclic aromatic hydrocarbons (PAHs), heavy metals (lead, cadmium), and elemental black carbon, it does not deliver high concentrations of nicotine.
> 3. **Non-Diagnostic:** SmogShield strictly prohibits presenting this equivalence as a personal medical diagnosis. It is labeled as an educational public health risk communication tool.

---

## 4. Corsi-Rosenthal (CR) Box Fan Purifier Engineering

### 4.1 CADR Formulation
Clean Air Delivery Rate ($\text{CADR}$) measures the volume of particulate-free air produced per minute:

$$\text{CADR} = Q_{\text{fan}} \times \varepsilon_{\text{single-pass}}$$

Where:
- $Q_{\text{fan}}$: Airflow rate delivered by the 20-inch box fan ($\sim 600 - 800\ \text{CFM}$ on medium speed).
- $\varepsilon_{\text{single-pass}}$: Single-pass efficiency of pleated MERV 13 / F7 media ($\sim 70 - 80\%$ for $0.3 - 1.0\ \mu\text{m}$ particulates).
- With 4 filters arranged in a cube (increased surface area reducing filter face velocity and static pressure drop) and a **14-inch circular cardboard shroud** to eliminate blade-tip vortex backflow, net tested CADR reaches **$250 - 320\ \text{CFM}$**.

### 4.2 Room Air Changes per Hour (ACH)
$$\text{ACH} = \frac{\text{CADR}\ (\text{CFM}) \times 60}{\text{Room Volume}\ (\text{ft}^3)}$$

Target for effective smog clearing in living quarters is **$4.0 - 6.0\ \text{ACH}$**.

---

## 5. Greenhouse Gas & Particulate Emission Swaps

### 5.1 Commuting Emission Factors
Based on **CPCB Urban Transport Emission Factors (2022)** and **IPCC Guidelines for National GHG Inventories**:

| Mode | Base $\text{CO}_2\text{e}$ Emission | Clean Alternative | $\Delta \text{CO}_2\text{e}$ Saved | $\Delta \text{PM}_{2.5}$ Tailpipe/Tire Saved |
|---|---|---|---|---|
| **Solo Petrol Car (1.2L)** | $180\ \text{g/km}$ | Delhi Metro ($25\ \text{g/passenger-km}$) | $155\ \text{g/km}$ | $0.08\ \text{g/km}$ |
| **Two-Wheeler (125cc)** | $55\ \text{g/km}$ | Metro / Electric Bus ($25\ \text{g/p-km}$) | $30\ \text{g/km}$ | $0.05\ \text{g/km}$ |

### 5.2 Biomass & Waste Burning Avoidance
- **Open Leaf / Garden Waste Burning:** Burning $1\ \text{kg}$ of fallen garden waste emits $\sim 1.4\ \text{kg}\ \text{CO}_2\text{e}$ and $\sim 8.5\ \text{grams}$ of fine $\text{PM}_{2.5}$ directly into the immediate breathing zone.
- **Biomass / Charcoal Angithi Heating:** An unvented angithi consumes $\sim 3\ \text{kg}$ of coal/wood per night, generating catastrophic indoor peaks of $>1,200\ \mu\text{g}/\text{m}^3\ \text{PM}_{2.5}$, toxic carbon monoxide, and $4.8\ \text{kg}\ \text{CO}_2$. Replacing with a 1000W electric radiator eliminates unvented combustion completely.

---

## 6. Peer-Reviewed References

1. **World Health Organization (2021).** *WHO Global Air Quality Guidelines: Particulate matter (PM2.5 and PM10), ozone, nitrogen dioxide, sulfur dioxide and carbon monoxide.* Geneva: World Health Organization.
2. **Muller, R., Muller, E., & Rohde, R. (2015).** *Air Pollution and Cigarette Equivalence: A Quantitative Health Communication Model.* Berkeley Earth.
3. **U.S. Environmental Protection Agency (2011).** *Exposure Factors Handbook: 2011 Edition.* EPA/600/R-09/052F, National Center for Environmental Assessment, Washington, DC.
4. **Corsi, R. & Rosenthal, J. (2021).** *Development and Field Performance of the Corsi-Rosenthal Box Air Cleaner for Indoor Airborne Aerosol Mitigation.* UC Davis College of Engineering.
5. **Central Pollution Control Board (2022).** *Air Quality Index Reporting Protocol and National Clean Air Programme (NCAP) Breakpoints.* MoEFCC, Government of India.
6. **Cummings, B. E., & Waring, M. S. (2019).** *Potted plants do not improve indoor air quality: a review and analysis of reported VOC removal efficiencies.* Journal of Exposure Science & Environmental Epidemiology, 30(2), 253-261.
