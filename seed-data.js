/* ──────────────────────────────────────────────────────────────
   COB Coverage Field Playbook — seed content + taxonomy metadata.
   One store, four content types: COB classes, vertical-risk cards,
   objection cards, and resources. Exposed as window.__PB_SEED.
   ────────────────────────────────────────────────────────────── */
(function () {
  let _uid = 1;
  const uid = (p) => `${p}-${Date.now().toString(36)}-${(_uid++).toString(36)}`;

  /* ── Taxonomies ── */
  const OBJECTION_CATS = ["Price", "Stall", "Incumbent", "Trust", "Cross-sell"];
  const VERTICAL_CATS  = ["Workers' Comp", "General Liability", "Professional Liability", "Commercial Auto", "BOP"];

  const CAT_TINT = {
    "Price":                  { bg: "var(--en-yellow-light)",   dot: "var(--en-yellow-d3)" },
    "Stall":                  { bg: "var(--en-warmgrey-light)", dot: "var(--en-warmgrey-d2)" },
    "Incumbent":              { bg: "var(--en-violet-light)",   dot: "var(--en-violet-d2)" },
    "Trust":                  { bg: "var(--en-iceblue-light)",  dot: "var(--en-iceblue-d3)" },
    "Cross-sell":             { bg: "var(--en-leaf-light)",     dot: "var(--en-leaf-d3)" },
    "Workers' Comp":          { bg: "var(--en-iceblue-light)",  dot: "var(--en-iceblue-d3)" },
    "General Liability":      { bg: "var(--en-leaf-light)",     dot: "var(--en-leaf-d3)" },
    "Professional Liability": { bg: "var(--en-violet-light)",   dot: "var(--en-violet-d2)" },
    "Commercial Auto":        { bg: "var(--en-orange-light)",   dot: "var(--en-orange-d3)" },
    "BOP":                    { bg: "var(--en-yellow-light)",   dot: "var(--en-yellow-d3)" },
  };

  /* must / rec / opt tiers for COB coverages */
  const TIER_ORDER = ["must", "rec", "opt"];
  const TIER_META = {
    must: { key: "must", label: "Need",       sub: "Bind before they open the doors",      tagClass: "en-tag--danger",  dot: "var(--en-red)" },
    rec:  { key: "rec",  label: "Recommended", sub: "Raise it on every qualifying account", tagClass: "en-tag--warning", dot: "var(--en-amber)" },
    opt:  { key: "opt",  label: "Consider",    sub: "Know it when the cue appears",         tagClass: "en-tag--info",    dot: "var(--en-teal)" },
  };

  /* ── COB classes — 16 SMB classes of business ── */
  const COB = [
    /* 1 ── Artisan Contractors ── */
    { id: "artisan", icon: "ti-tools", accent: "#e87a16", bg: "var(--en-orange-light)",
      title: "Artisan Contractors",
      types: ["Electricians", "Plumbers", "HVAC", "Carpentry & finish", "Flooring & tile", "Other trades (drywall, masonry, install)"],
      policies: {
        must: [
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages when they're hurt on the job. Required by law in nearly every state the moment you have a single employee.", signal: "Any employee, including a single helper. Ask the EMR directly — it's a number they should know, and GCs check it before awarding a job.", when: "Day 1 with any employee; GCs require it from every sub", cross: "The EMR isn't just a rate — it's a business qualification. A clean mod wins bids; a bad one loses them.", claim: "An electrician falls from a ladder and fractures his wrist and elbow, needing surgery and three months off. Workers' comp covers the $90,000 in medical care and lost wages — and a single claim this size can lift the EMR for years." },
          { name: "General liability / BOP", desc: "GL covers injury to other people or damage to their property from your work, including faulty work that surfaces after the job is done. A BOP is that same GL bundled with property and business-income coverage — the better fit once a contractor has a shop or office, and it can be endorsed to widen business income.", signal: "They work on or around client property. Confirm completed-operations coverage isn't sublimited — trade claims often surface long after the job closes.", when: "Before the first job — every contract and most homeowners require proof", cross: "Foundation for the Umbrella; carriers require GL underneath it", claim: "A plumber's solder joint fails weeks after the job and floods a finished basement — a $30,000 water-damage claim. GL's completed-operations coverage responds to work that already left the site." },
          { name: "Commercial / hired & non-owned auto", desc: "Covers accidents involving business vehicles — and employees who drive their own trucks to job sites (Hired & Non-Owned Auto). Personal auto policies exclude regular business use.", signal: "Any owned vehicle, or crew driving their own trucks to sites (add Hired & Non-Owned Auto). 'How does your crew get to the job?' separates the need.", when: "Any vehicle used for the business; HNOA as a cheap backstop for personal-vehicle crews", cross: "Umbrella sits over Auto — a loaded-truck accident is the most likely 7-figure loss a trade ever sees", claim: "A helper rear-ends a car on the way to a site in his own pickup and the injury claim hits $120,000. His personal carrier denies it as business use — HNOA covers the gap." },
          { name: "Inland marine (tools & equipment floater)", desc: "Covers tools and equipment wherever they go — in the truck, in transit, or on the job site. A building-based property policy won't reach gear that has left the premises.", signal: "'What are your tools worth, and do they leave a shop?' Over ~$15K and mobile = clear need.", when: "$15K+ in mobile tools and equipment", cross: "Separate from any shop property policy — sometimes called a Contractor's Equipment Floater", claim: "A locked job-site trailer holding $22,000 of tools is stolen overnight. The equipment floater replaces it; a shop property policy would deny gear that left the premises." },
        ],
        rec: [
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit on top of GL, Auto, and Workers' Comp, for the serious claim that blows past the primary limit.", signal: "Most GC contracts specify a required umbrella ($2M-$5M+). Ask to see the insurance requirements in their current contracts.", when: "$2M minimum for most GC work; contracts often dictate more", cross: "Carriers weigh the EMR and safety record when pricing it — everything ties back to claims history", claim: "A scaffold board fails and a passerby is seriously hurt; the judgment reaches $2.8M against a $1M GL limit. The umbrella covers the $1.8M difference." },
          { name: "Installation floater / builders risk", desc: "Covers materials after delivery but before they're installed, and structures while they're being built. A finished-building property policy covers neither.", signal: "They install expensive materials (HVAC units, cabinetry, fixtures) or do ground-up and major-reno work where the structure-in-progress is exposed.", when: "Any high-value install or new-build / major reno", cross: "Builders risk expires at completion — then permanent Property takes over", claim: "A delivered but uninstalled $18,000 HVAC system is stolen from a job site before hookup. The installation floater pays — the homeowner's policy doesn't cover the contractor's materials." },
          { name: "Professional liability (E&O)", desc: "Covers mistakes in design, plans, or specifications — for contractors who design as well as build. GL covers the physical work; E&O covers the design judgment behind it.", signal: "They design as well as build, or provide professional specs/plans. 'Do you design, or only build to someone else's drawings?' separates the need.", when: "Any design-build or design services", cross: "GL covers the physical work; E&O covers the design judgment behind it", claim: "A design-build remodeler's faulty beam spec leads to a sagging floor. The owner sues over the design, not the workmanship — E&O covers what GL would exclude." },
          { name: "Pollution liability", desc: "Covers pollution claims — fumes, spills, refrigerant releases, or asbestos and lead disturbance — that standard GL specifically excludes.", signal: "Demolition, work in pre-1980 buildings, HVAC refrigerant handling, or solvent and fuel use.", when: "Any demolition, abatement-adjacent, or chemical/fuel handling work", cross: "GL's pollution exclusion surprises trade clients after a loss — name it before they sign", claim: "An HVAC tech's refrigerant release contaminates a tenant space and triggers a cleanup order. Pollution liability responds — GL's pollution exclusion would leave it uncovered." },
        ],
        opt: [
          { name: "Surety & license bonds", desc: "Not insurance, but a guarantee that you'll finish the job (performance/payment bonds) or follow state licensing law. Often required for public and large private work.", signal: "Public projects, large private jobs, or a state license requirement.", when: "Public work, large private jobs, or licensing requirements", cross: "Bonding capacity ties to financials and EMR — the same factors that drive WC also gate bonding", claim: "A contractor walks off a public job before completion. The performance bond pays to bring in another firm and finish the work." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wrongful termination, harassment, discrimination, and wage disputes, including 1099 misclassification.", signal: "5+ employees, or any worker-classification gray area.", when: "5+ employees, earlier in high-litigation states", cross: "Worker misclassification is the classic trade EPLI and wage-and-hour trigger", claim: "A laborer classified as 1099 files a misclassification and unpaid-overtime claim. EPLI covers the defense and settlement." },
          { name: "Subcontractor default", desc: "Covers a general contractor's costs when a subcontractor fails to finish their work — an alternative to bonding every sub.", signal: "GCs coordinating many subs where bonding each isn't practical.", when: "GCs managing 10+ subcontractors", cross: "Requires rigorous sub prequalification to work", claim: "A framing sub defaults mid-job and the GC absorbs $80,000 in delay and replacement costs. Subcontractor default coverage reimburses them." },
          { name: "Cyber liability", desc: "Covers the cost of a data breach — notification, response, and liability — for contractors storing customer details, estimates, and payment info in software.", signal: "Online estimating or invoicing, stored customer payment data, or email-based proposals.", when: "Any contractor handling customer data or payments electronically", cross: "Even trades that don't think of themselves as 'tech' hold breachable customer and payment data", claim: "Ransomware locks the firm's estimating and scheduling software for a week and exposes customer payment details. Cyber covers the recovery and notification costs." },
        ],
      } },

    /* 2 ── Cleaning & Janitorial Services ── */
    { id: "cleaning", icon: "ti-spray", accent: "#0f94a7", bg: "var(--en-iceblue-light)",
      title: "Cleaning & Janitorial Services",
      types: ["Commercial janitorial", "Residential housekeeping", "Office cleaning", "Carpet & upholstery", "Window cleaning (≤3 stories)", "Move-out & post-construction"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers injury to other people or damage to their property from your work — the classic case is a slip-and-fall on a floor you just cleaned. A BOP bundles that same GL with property and business-income coverage for firms with a shop or office.", signal: "'Where does the work physically happen?' Almost always inside or around someone else's space. Wet floors without signage are the classic loss.", when: "Day 1 — clients and management contracts require it", cross: "Foundation for Umbrella; pair with Care/Custody/Control to close the on-site gap GL leaves open", claim: "A tenant slips on a freshly mopped lobby floor left without a wet-floor sign and breaks a wrist — a $40,000 claim. GL covers the single most frequent loss cleaning firms see." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a job injury. Required by law once you have employees.", signal: "Any cleaning staff. Chemical handling and solo after-hours work elevate the risk.", when: "First employee", cross: "Higher hazard than office WC because of chemical and slip exposure", claim: "A night-shift cleaner mixes two incompatible chemicals, is overcome by fumes, and is hospitalized. Workers' comp covers the medical care and lost wages." },
          { name: "Care, custody & control / bailee", desc: "Covers damage to a client's property while it's in your care — something standard GL excludes. The classic loss is a lost master key that forces a whole building to be re-keyed.", signal: "'Do you hold keys, alarm codes, or work inside client space unsupervised?' A yes means GL alone leaves a hole. A lost master key can mean re-keying a whole building.", when: "Anyone with keys/access or working inside client premises", cross: "The single most-missed coverage in this class — GL's care/custody exclusion surprises clients after a loss", claim: "A cleaner loses the master key to a 40-unit building and the whole property must be re-keyed — an $18,000 bill. GL denies it under care/custody; this coverage pays." },
          { name: "Janitorial bond / employee dishonesty", desc: "Reimburses a client if one of your employees steals from them. It's a common requirement to win commercial cleaning contracts.", signal: "'Do your clients require you to be bonded?' Most commercial contracts do. Unsupervised access to valuables is the exposure.", when: "Any cleaning firm bidding commercial contracts", cross: "The bond satisfies the contract; crime/fidelity gives the firm broader protection against internal theft", claim: "A cleaner pockets a $6,000 watch from an executive office. The janitorial bond reimburses the client, satisfies the contract, and keeps the account from walking." },
        ],
        rec: [
          { name: "Commercial / hired & non-owned auto", desc: "Covers business vehicles and employees driving between sites — including their own cars (Hired & Non-Owned Auto). Personal auto excludes business use.", signal: "Multiple sites per day = constant driving. Owned vans, or employees in personal vehicles (add HNOA).", when: "Any business vehicle or regular site-to-site driving", cross: "Umbrella extends over Auto", claim: "A cleaning van rear-ends a car between job sites and injures the driver — a $120,000 claim. Commercial auto covers it where a personal policy would deny the business use." },
          { name: "Pollution liability", desc: "Covers pollution claims from cleaning chemicals, mold, or sewage work — which GL's pollution exclusion leaves out.", signal: "'Do you do mold, water-damage, or hazmat cleanup?' or heavy industrial chemical use.", when: "Any remediation or heavy chemical work", cross: "GL excludes pollution — remediation work without this is largely uncovered", claim: "A sewage backup the crew was cleaning spreads contamination through a finished basement. Pollution liability responds — GL's exclusion would leave it uncovered." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL, Auto, and Workers' Comp — important when you service many locations.", signal: "Many serviced sites, larger crews, or contracts requiring higher limits.", when: "$1M+ underlying or contractual requirement", cross: "Multi-location operations stack frequency — the umbrella protects against the one severe loss", claim: "A severe slip-and-fall at a serviced property produces a $2M judgment. The umbrella covers the amount above the GL limit." },
        ],
        opt: [
          { name: "Property / BOP", desc: "Covers the firm's own equipment, supplies, and shop contents. Bundled with GL it becomes a BOP, which can be endorsed to add business income when a covered event shuts you down.", signal: "An owned shop, warehouse, or significant on-premises equipment.", when: "Any fixed location with equipment or inventory", cross: "Add an equipment floater for gear that travels — property won't cover it off-premises", claim: "A fire in the supply warehouse destroys $25,000 of extractors and inventory. Property coverage replaces it." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wage disputes, discrimination, and wrongful termination — common in a high-turnover workforce.", signal: "5+ employees, or any wage-and-hour or classification gray area.", when: "5+ employees", cross: "Wage & hour is the fastest-growing claim in this labor-intensive class", claim: "Cleaners file a class action over unpaid overtime and off-the-clock travel time. EPLI covers the wage-and-hour defense and settlement." },
          { name: "Cyber liability", desc: "Covers the cost of a data breach — notification, response, and liability — for firms storing client access codes, schedules, or payment data online.", signal: "Online scheduling, stored client building-access data, or digital payments.", when: "Any firm holding client data or access credentials electronically", cross: "Access-code databases are an underappreciated breach target for this class", claim: "The scheduling platform is breached, exposing client building-access codes. Cyber covers notification and the credential-reset response." },
        ],
      } },

    /* 3 ── Landscaping & Lawn Care ── */
    { id: "landscape", icon: "ti-plant-2", accent: "#009284", bg: "var(--en-leaf-light)",
      title: "Landscaping & Lawn Care",
      types: ["Landscape design & install", "Lawn maintenance", "Irrigation/sprinkler", "Mulching & planting", "Light hardscaping", "Seasonal cleanup & snow"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers injury to other people or damage to their property from your work — a thrown rock, a damaged irrigation line, chemical drift. A BOP bundles that same GL with property and business-income coverage for firms with a yard or shop.", signal: "They work on client and neighboring property. Ask specifically about utility strikes and chemical application — both are common claim sources.", when: "Before the first job — every contract requires it", cross: "Completed-operations matters for install work; confirm it isn't sublimited", claim: "A mower throws a rock through a client's picture window and dents a parked car — $12,000 across both. GL covers the everyday job-site accident." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a job injury. Required by law once you have any crew, including seasonal labor.", signal: "Any crew member, including seasonal labor. Equipment and heat are the frequency drivers.", when: "Day 1 with any employee", cross: "Seasonal headcount swings — confirm the policy captures peak-season crews", claim: "A worker's hand is caught in a mower deck and requires surgery. Workers' comp covers the $45,000 in medical care and the lost season." },
          { name: "Commercial auto", desc: "Covers business trucks and the trailers they tow. Heavy loads and high mileage make collisions severe; crew in personal trucks need Hired & Non-Owned Auto.", signal: "Any owned or leased vehicle, and any trailer towing. Crew in personal trucks = add Hired & Non-Owned Auto.", when: "Any vehicle used for the business", cross: "Umbrella over Auto is essential — a loaded-trailer highway accident easily generates $5M+ in claims", claim: "A loaded equipment trailer jackknifes on the highway and injures two people; the claim reaches $1.5M. Commercial auto responds where a personal policy would deny the business use." },
          { name: "Inland marine (equipment floater)", desc: "Covers mowers, blowers, trimmers, skid steers, and trailers wherever they are — places a shop property policy won't reach. This gear is high-value and frequently stolen.", signal: "'What's the equipment worth, and where does it sleep at night?' Trailers left loaded overnight are prime theft targets.", when: "$20K+ in mobile equipment", cross: "Separate from any office/shop property policy", claim: "A trailer of mowers, blowers, and a skid steer — $40,000 of gear — is stolen overnight from a site. The equipment floater replaces it; shop property would not." },
        ],
        rec: [
          { name: "Pollution liability", desc: "Covers pollution claims from herbicide, pesticide, and fertilizer use and drift — which GL's pollution exclusion leaves out. The most-missed exposure in this class.", signal: "'Do you apply chemicals or treat lawns?' Almost always yes — and almost always uncovered.", when: "Any chemical application or fuel handling", cross: "Chemical-drift is the most-missed exposure in the whole class — GL won't touch it", claim: "Herbicide drifts onto a neighboring organic farm and ruins the crop; the neighbor sues for $85,000. Pollution liability responds — GL's exclusion would leave the contractor fully exposed." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL, Auto, and Workers' Comp — for the loaded-trailer accident or chemical claim that exceeds the primary limit.", signal: "Owned trucks/trailers, chemical work, or contracts requiring higher limits.", when: "$1M+ underlying or contractual requirement", cross: "Auto severity drives the umbrella decision for this class", claim: "An at-fault trailer accident produces a $2.3M judgment, exhausting the $1M auto limit. The umbrella covers the remaining $1.3M." },
          { name: "Snow/ice & seasonal ops", desc: "Covers slip-and-fall claims on properties you plow or de-ice in winter. It must be specifically scheduled on the GL — many policies carve it out.", signal: "'Do you plow or de-ice in winter?' Year-round operators usually do — and the slip exposure is severe.", when: "Any operator offering snow/ice services", cross: "Confirm snow ops aren't carved out of the base GL — many policies exclude them", claim: "A customer slips on a lot the crew was contracted to de-ice and breaks an arm. The claim is covered only because snow ops were scheduled on the GL." },
          { name: "Professional liability (E&O)", desc: "Covers design errors — a faulty grading or drainage plan — for firms that design as well as install. GL covers the physical work; E&O covers the design judgment.", signal: "They design as well as install, or provide professional drainage/grading plans.", when: "Any landscape-design or design-build services", cross: "GL covers the physical work; E&O covers the design judgment", claim: "A firm's faulty grading plan causes water to pool against a client's foundation. The owner sues over the design — E&O covers what GL excludes." },
        ],
        opt: [
          { name: "Installation floater / builders risk", desc: "Covers high-value materials — trees, pavers, stone, irrigation — after delivery but before install, and hardscape structures in progress.", signal: "Large install jobs with expensive materials staged on site before completion.", when: "Any large install with high-value staged materials", cross: "Materials on site aren't covered by the client's property policy", claim: "$15,000 of specimen trees and pavers staged for a job are damaged in a storm before install. The installation floater covers the loss." },
          { name: "License & permit bonds", desc: "A guarantee, not insurance, that you'll meet state licensing rules or the terms of public right-of-way work. Required in many states.", signal: "A state license requirement or municipal permit work.", when: "Licensing or public-right-of-way requirements", cross: "Bonding capacity ties to financials and loss history", claim: "A municipality requires a permit bond before approving a streetscape job. The bond satisfies the requirement and the work proceeds." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wage disputes, discrimination, and misclassification — common with seasonal, high-turnover labor.", signal: "5+ seasonal workers or any 1099/classification gray area.", when: "5+ employees", cross: "Seasonal misclassification is the classic trigger here", claim: "Seasonal crew members file an unpaid-overtime claim. EPLI covers the wage-and-hour defense and settlement." },
          { name: "Cyber liability", desc: "Covers the cost of a data breach for firms storing customer schedules, contracts, and payment details online.", signal: "Online scheduling, recurring billing, or stored customer payment data.", when: "Any firm holding customer data or processing payments online", cross: "Recurring-billing customer data is an underappreciated breach target for this class", claim: "The billing platform is breached and customer card data is exposed. Cyber covers notification and the response." },
        ],
      } },

    /* 4 ── Food Service & Hospitality ── */
    { id: "food", icon: "ti-tools-kitchen-2", accent: "#8e0038", bg: "var(--en-rose-50)",
      title: "Food Service & Hospitality",
      types: ["Sit-down restaurants", "Fast-casual & cafés", "Bakeries & delis", "Coffee & juice bars", "Caterers", "Food trucks"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers injury to guests and damage to other people's property. A BOP bundles that same GL with property coverage for the building, kitchen equipment, and contents, plus business income — set property limits to full replacement, and business income can be endorsed wider.", signal: "Any guest-facing food operation with a space and equipment. Confirm property limits reflect full replacement, not depreciated value.", when: "Before opening — required by lease and franchise agreements", cross: "Foundation for Liquor Liability and Umbrella; pair with Business Income for a realistic restoration period", claim: "A grease fire destroys $150,000 of kitchen equipment and a customer later slips on a spill — the BOP's property side pays full replacement while its GL side covers the injury." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a job injury — kitchen burns, cuts, and slips are common. Required by law once you have staff.", signal: "Any staff — kitchen, service, delivery. High turnover means inexperienced workers, a claim driver.", when: "First employee", cross: "Pairs with EPLI — tipped/hourly workforces generate both injury and employment claims", claim: "A line cook suffers a severe grease burn needing skin grafts and weeks off. Workers' comp covers the medical care and wage replacement." },
          { name: "Liquor liability", desc: "If you serve, sell, or allow alcohol, this covers claims tied to an intoxicated patron — including harm they cause after leaving. Standard GL excludes liquor for businesses that serve.", signal: "'Do you serve, sell, or host alcohol anywhere?' Includes catered events and BYOB in some states.", when: "Any alcohol service of any kind", cross: "GL excludes this for servers — it's a true gap, and Umbrella sits on top of it", claim: "A patron over-served at the bar causes a fatal crash on the way home; the family sues the establishment. Liquor liability covers the dram-shop claim GL excludes." },
        ],
        rec: [
          { name: "Business income", desc: "Replaces lost revenue and covers fixed costs when a covered event forces you to close. Usually added to the BOP — set the restoration period to a realistic rebuild time.", signal: "'How long could you survive closed?' Period of restoration should match a realistic rebuild timeline.", when: "Every operation — period of restoration is the key lever", cross: "Add Extra Expense for temporary operations; triggered by the same perils as Property", claim: "A fire closes a restaurant for three months. Business income replaces the lost revenue and covers rent and payroll — the difference between reopening and never coming back." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL, Liquor, and Auto — for a catastrophic guest injury or multi-victim DUI.", signal: "Alcohol service, high guest volume, or franchise-mandated limits.", when: "As soon as $1M underlying exists; franchises often require more", cross: "Requires clean underlying GL, Liquor, and Auto to attach", claim: "A multi-victim DUI tied to over-service produces a $4M judgment. The umbrella covers everything above the primary liquor and GL limits." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wage disputes (the fastest-growing claim, driven by tips and overtime), harassment, discrimination, and wrongful termination.", signal: "Tipped workforce, high turnover, 5+ employees. Tip-pooling and overtime are flashpoints.", when: "5+ employees or any tipped staff", cross: "Confirm the policy covers wage & hour — acute with tipped workers", claim: "Servers file a class action over an improper tip pool and unpaid overtime. EPLI covers the wage-and-hour defense and settlement." },
        ],
        opt: [
          { name: "Equipment breakdown", desc: "Covers mechanical or electrical failure of refrigeration, HVAC, and cooking equipment — breakdowns that property's fire-based coverage excludes.", signal: "Refrigeration-dependent kitchens; significant mechanical systems.", when: "Any refrigeration or major equipment dependence", cross: "Add Spoilage for perishable inventory alongside breakdown", claim: "A walk-in cooler compressor fails overnight and $20,000 of inventory spoils. Equipment breakdown covers the repair and lost stock — a failure fire-based property excludes." },
          { name: "Food contamination / spoilage", desc: "Covers spoiled inventory from an equipment or power failure, plus lost income from a health-department shutdown.", signal: "Significant perishable inventory; reliance on refrigeration.", when: "Kitchens with $10K+ perishables", cross: "Often a Property endorsement — confirm whether it's included", claim: "A contamination scare triggers a health-department shutdown; the operator loses a week of revenue and discards perishables. Contamination coverage responds to both." },
          { name: "Commercial auto", desc: "Covers delivery vehicles, catering transport, and food trucks. Personal auto excludes business use; employee vehicles need Hired & Non-Owned Auto.", signal: "Delivery, catering transport, or a food truck. Employee vehicles = add HNOA.", when: "Any owned vehicle or delivery operation", cross: "Delivery and catering exposure feeds the Umbrella decision", claim: "A catering van is in an at-fault accident that injures two people. Commercial auto covers the claim a personal policy would deny for business use." },
        ],
      } },
    /* 5 ── Retail Trade ── */
    { id: "retail", icon: "ti-building-store", accent: "#187caa", bg: "#e6f3fa",
      title: "Retail Trade",
      types: ["Apparel & gift", "Florists & specialty", "Sporting goods & books", "Hardware & pet", "Jewelry (small)", "E-commerce + storefront"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers customer injuries and your products-liability exposure as the seller. A BOP bundles that GL with property coverage for inventory, fixtures, and the building, plus business income — set property limits to peak-season inventory value.", signal: "A storefront with customer traffic and stock. Set property limits to holiday-season peak, not the January low.", when: "Before opening — landlords require it", cross: "Products liability sits inside GL but is often sublimited; confirm the limit if product sales are core", claim: "A fire destroys $250,000 of holiday inventory and a customer later trips on a display — the BOP's property side pays for the stock while its GL side covers the injury." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a job injury — lifting and stocking strains are common. Required by law once you have staff.", signal: "Any staff, including seasonal and part-time.", when: "First employee", cross: "Return-to-work programs control the EMR — retail claims are frequent but manageable", claim: "A stock clerk herniates a disc lifting a heavy carton. Workers' comp covers the surgery and recovery time." },
          { name: "Business income", desc: "Replaces lost revenue and fixed costs when a covered event closes the store. Usually part of the BOP — thin retail margins make even two weeks dark dangerous.", signal: "'If a burst pipe closed you for a month, could you cover rent and payroll?' Period of restoration should fit a realistic rebuild.", when: "Every retail property policy", cross: "Add Extra Expense for a temporary/pop-up location while rebuilding", claim: "A burst sprinkler pipe closes the store for three weeks. Business income covers rent, payroll, and lost sales while the doors are shut." },
        ],
        rec: [
          { name: "Product liability", desc: "Covers injury or damage caused by products you sell, even as a reseller. Usually sits inside GL but is often sublimited — confirm the limit if products are core.", signal: "Selling consumables, electronics, cosmetics, or children's products. Private-label or imported goods raise it further.", when: "Any physical product sales", cross: "Usually within GL but often sublimited — confirm if products are the core business", claim: "A space heater sold by the store overheats and starts a customer's house fire. As the seller, the retailer is named — product liability covers the defense." },
          { name: "Crime / theft", desc: "Covers money and inventory lost to employee theft, burglary, or robbery — including employee dishonesty, which property coverage excludes.", signal: "Cash handling, or high-value inventory (jewelry, electronics, firearms).", when: "Any cash business or high-value stock", cross: "Property's limited theft coverage doesn't include employee dishonesty — Crime does", claim: "A trusted cashier skims $30,000 over a year. Crime coverage reimburses the loss; property's theft coverage excludes employee dishonesty." },
          { name: "Cyber liability", desc: "Covers the cost of a data breach — notification, forensics, and PCI fines — for stores processing card payments online or in person.", signal: "Any online sales channel or card-present processing — effectively all retail.", when: "Any card processing or online store", cross: "PCI compliance reduces risk but doesn't replace insurance — cyber covers the residual", claim: "The POS system is breached and thousands of customer cards are exposed. Cyber covers notification, forensics, and PCI fines." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL — a serious in-store injury can exceed the primary limit fast.", signal: "High foot traffic or revenue over ~$500K.", when: "$500K+ revenue or high traffic", cross: "Drops over GL and Auto — confirm underlying limits meet the umbrella minimums", claim: "A falling display fixture seriously injures a shopper and the judgment exceeds the $1M GL limit. The umbrella covers the excess." },
        ],
        opt: [
          { name: "Equipment breakdown", desc: "Covers mechanical or electrical failure of refrigeration, HVAC, security, or POS hardware — perils standard property excludes.", signal: "Refrigeration reliance (grocery, florist) or specialized equipment.", when: "Refrigeration or specialized equipment", cross: "Add Spoilage if stocking perishables", claim: "A florist's cooler fails and $8,000 of inventory wilts. Equipment breakdown plus spoilage covers the loss property's fire-based coverage excludes." },
          { name: "Commercial auto", desc: "Covers delivery and supply-run vehicles. Personal auto excludes business use; employee cars need Hired & Non-Owned Auto.", signal: "Any owned delivery vehicle, or employees delivering in personal cars (add HNOA).", when: "Any delivery or mobile operation", cross: "If delivery is a real revenue channel, the auto exposure is real", claim: "A delivery van is in an at-fault accident on a supply run. Commercial auto covers the claim a personal policy would deny." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — discrimination, harassment, wrongful termination, and wage disputes.", signal: "10+ employees or a mix of management and hourly staff.", when: "10+ employees", cross: "Wage & hour is the fastest-growing retail EPLI exposure", claim: "A seasonal hire files a discrimination claim after being let go. EPLI covers the defense costs." },
        ],
      } },

    /* 6 ── Real Estate & Habitational ── */
    { id: "realestate", icon: "ti-building-skyscraper", accent: "#545241", bg: "var(--en-warmgrey-light)",
      title: "Real Estate & Habitational",
      types: ["Lessor's risk / building owners", "Property management", "Agents & brokers", "Mortgage & title", "Inspectors & appraisers", "Condo / HOA associations"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL (lessor's risk) covers people hurt at your owned or managed buildings. A package policy bundles that GL with property coverage for the building itself, plus loss-of-rents — the building is usually the largest asset on the policy.", signal: "'Do you own, lease out, or manage physical property?' Common areas, stairwells, and lots are the recurring loss sources.", when: "Day 1 — leases and management contracts require it", cross: "Pair the property side with loss-of-rents — a fire stops the rent while property only rebuilds", claim: "A tenant slips on an icy common stairwell and a fire later damages the upper floors — the GL side covers the injury while the property and loss-of-rents side rebuilds and replaces lost rent." },
          { name: "Professional liability (E&O)", desc: "Covers financial harm from professional mistakes — a failure to disclose, a valuation or inspection error, a mishandled deposit. The core exposure for agents, managers, inspectors, and appraisers.", signal: "They advise, transact, value, inspect, or manage on behalf of others. Any deliverable a client relies on is the trigger.", when: "Before the first transaction or management engagement", cross: "GL covers a slip at an open house; E&O covers the advice and judgment — two separate exposures", claim: "A home inspector misses active roof damage and the buyer sues for $90,000 in repairs. E&O covers the defense and settlement; GL would deny it." },
          { name: "Cyber liability", desc: "Covers data breaches and wire-transfer fraud — the #1 cyber loss in real estate, where fraudsters intercept closing instructions and redirect funds.", signal: "'Do you send or receive wire instructions, or store tenant/buyer data?' Email-based closing instructions are the classic social-engineering target.", when: "Any firm handling closings, rents, or stored client data", cross: "Crime covers theft of the firm's money; Cyber covers fraud against client funds and data breaches", claim: "A fraudster spoofs a closing email and a buyer wires $200,000 to the wrong account. Cyber funds the breach response and the social-engineering loss." },
        ],
        rec: [
          { name: "Crime / fidelity", desc: "Covers money stolen by employees or lost to fraud against funds you hold — rents, security deposits, and reserves.", signal: "They collect or hold tenant/owner funds, or have signatory authority over building accounts.", when: "Any firm holding client funds", cross: "Pairs with E&O for managers — funds-handling creates both error and theft exposure", claim: "An employee with account access diverts $50,000 in collected rents over months. Crime coverage reimburses the loss the firm owes its owners." },
          { name: "Management liability (D&O)", desc: "Covers the governance and fiduciary decisions of condo/HOA boards and the firms that manage them — including special-assessment and discrimination disputes.", signal: "They serve, advise, or sit on HOA/condo association boards.", when: "Any firm managing or serving association boards", cross: "Distinct from the firm's own corporate D&O — relates to the boards they manage", claim: "A homeowner sues the HOA board the firm manages over a special-assessment decision. D&O covers the defense of the management decision." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL and Auto — valuable across many properties and daily interactions.", signal: "Multiple owned/managed properties or contracts requiring higher limits.", when: "$1M+ underlying or contractual requirement", cross: "Multi-property frequency makes one severe loss a matter of time", claim: "A severe slip-and-fall at a managed property produces a $2M judgment. The umbrella covers the amount above the GL limit." },
        ],
        opt: [
          { name: "Tenant discrimination / fair housing", desc: "Covers fair-housing and tenant-discrimination claims from leasing, screening, and eviction decisions — often excluded or sublimited on base forms.", signal: "Any leasing, tenant-screening, or eviction activity.", when: "Any habitational management operation", cross: "Confirm whether fair-housing defense is inside the E&O or needs a standalone form", claim: "A rejected applicant files a fair-housing discrimination complaint over screening criteria. The coverage funds the defense." },
          { name: "Equipment breakdown", desc: "Covers mechanical failure of boilers, elevators, HVAC, and building systems — perils property excludes.", signal: "Buildings with elevators, boilers, or large HVAC plant.", when: "Any building with significant mechanical systems", cross: "Elevator and boiler failure is a classic habitational breakdown loss", claim: "A building boiler fails in winter and must be replaced; tenants lose heat. Equipment breakdown covers the repair and resulting losses property excludes." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wrongful termination, harassment, and discrimination — from on-site staff and leasing teams.", signal: "5+ employees across offices or properties.", when: "5+ employees", cross: "Bundles with D&O as a management-liability package", claim: "A terminated leasing agent files a discrimination suit. EPLI covers the defense and settlement." },
        ],
      } },

    /* 7 ── Professional & Financial Services ── */
    { id: "prof", icon: "ti-briefcase", accent: "#b31767", bg: "var(--en-violet-light)",
      title: "Professional & Financial Services",
      types: ["Accountants & bookkeepers", "Tax preparers", "Business consultants", "Insurance & financial advisors", "Payroll & HR", "Notaries & translators"],
      policies: {
        must: [
          { name: "Professional liability (E&O)", desc: "Covers financial harm caused by your professional work or advice — a filing error, a bad recommendation, unsuitable guidance. The core exposure for the entire group.", signal: "They give advice, prepare filings, or produce deliverables a client relies on. 'My clients depend on me getting it right' is the cue.", when: "Before the first client engagement — many client contracts require proof of E&O", cross: "GL covers a visitor tripping in the office; E&O covers your judgment causing financial loss — never assume one covers the other", claim: "A bookkeeper transposes two digits on a client's payroll filing; the IRS penalty plus lost interest reaches $42,000 and the client sues. E&O pays the defense and settlement — GL would deny it outright." },
          { name: "General liability / BOP", desc: "GL covers basic injury and property-damage claims — a client slips in your lobby. A BOP bundles that same GL with property and business-income coverage, the cheapest way for an office firm to package the basics.", signal: "An office, in-person client meetings, or client-site visits. Even a home office with client visits creates premises exposure.", when: "Day 1 — a BOP is the cheapest way to package the basics", cross: "The BOP is the foundation everything else sits on — Umbrella requires GL underneath", claim: "A client catches her heel on a frayed lobby rug and fractures her wrist — a $28,000 claim. The GL inside the BOP covers it in full." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a work injury — even desk work causes carpal tunnel and strains. Required by law once you have a W-2 employee.", signal: "Any employee beyond the owner, including part-time and remote staff.", when: "First W-2 hire", cross: "Low hazard, but a single repetitive-stress claim runs $30K+ — don't let a client skip it", claim: "A staff accountant develops carpal tunnel needing surgery and reduced hours. Workers' comp covers the $35,000 and shields the firm from a direct lawsuit." },
          { name: "Cyber liability", desc: "Covers the cost of a data breach for firms holding sensitive client data — tax records, SSNs, bank details. Includes ransomware, regulatory fines, and client notification.", signal: "'Where do you store client financial or personal data?' Any computer or cloud service makes the exposure real. Wire instructions in email = social-engineering target.", when: "Any firm storing client data electronically — universal now", cross: "Crime covers theft of money; Cyber covers theft of data — firms handling both need both", claim: "A phishing email tricks staff into wiring $90,000 to a fraudster and exposes client SSNs. Cyber funds the forensics, notification, and a year of credit monitoring." },
        ],
        rec: [
          { name: "Crime / fidelity", desc: "Covers money stolen by employees or lost to fraud and forgery — critical where staff can access client bank accounts.", signal: "'Do you handle client money, sign checks, or access client accounts?' A yes makes this near-mandatory.", when: "Any firm with signatory authority or access to client funds", cross: "Often a client-contract requirement in financial services — check engagement letters", claim: "A trusted office manager diverts $120,000 from the operating account over two years. Crime coverage reimburses it — employee dishonesty is excluded by a standard BOP." },
          { name: "Hired & non-owned auto", desc: "Covers employees who drive their own cars for work, which personal auto policies exclude. Important for any firm whose team visits clients.", signal: "'How often is your team driving to clients?' No company cars doesn't mean no exposure — HNOA covers the personal-vehicle gap.", when: "Outside consultants on day 1; office firms add HNOA as a cheap backstop", cross: "Umbrella sits over Auto — a serious accident is the likeliest 7-figure claim an office firm sees", claim: "A consultant rear-ends a car en route to a client and the injury claim reaches $250,000. His personal carrier denies it as business use — HNOA responds." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wrongful termination, harassment, discrimination, and wage disputes. Knowledge workers litigate readily.", signal: "5+ employees, or any firm in an employee-friendly state (CA, NY, NJ, IL).", when: "5+ employees, earlier in high-litigation states", cross: "Bundles with D&O as a management-liability package", claim: "A terminated employee files a wrongful-termination and discrimination suit. Even though the firm acted properly, defense costs reach $65,000 before dismissal. EPLI covers it." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL, Auto, and Workers' Comp — a serious auto accident can blow past the primary limit.", signal: "Revenue over $1M, a client contract demanding higher limits, or meaningful driving exposure.", when: "$1M+ underlying limits or a contractual requirement", cross: "Get underlying GL, Auto, and WC to the umbrella's minimums first, or it won't attach", claim: "A serious at-fault auto accident produces a $2.3M judgment, exhausting the $1M auto limit. The umbrella picks up the remaining $1.3M." },
        ],
        opt: [
          { name: "Management liability (D&O)", desc: "Protects owners, partners, and directors personally against claims of mismanagement or breach of fiduciary duty.", signal: "A board, outside investors, or a multi-partner structure.", when: "Firms with a board, investors, or partnership governance", cross: "Side A protects personal assets — the part owners care about most", claim: "A minority partner sues the managing partners over a decision that destroyed firm value. D&O pays the partners' personal defense costs." },
          { name: "Business income", desc: "Replaces lost revenue and fixed costs when a covered event closes your office. Usually part of the BOP — confirm the limit covers a few months.", signal: "'If you couldn't access your office for a month, what happens to revenue?' Usually inside the BOP — confirm the limit.", when: "Confirm it's adequate on the BOP — most are underinsured", cross: "Property pays to rebuild; Business Income pays the bills while you can't operate", claim: "A burst pipe makes the office unusable for six weeks during tax season. Business income replaces the lost billings and keeps payroll running." },
          { name: "Media liability", desc: "Covers defamation, copyright, and IP claims from content you publish — reports, newsletters, and thought leadership.", signal: "They publish white papers, newsletters, or heavy web/social content.", when: "Firms producing significant published content", cross: "Sometimes folded into E&O — check before buying standalone", claim: "A consultant's published report reproduces a competitor's proprietary chart without permission, and the competitor sues. Media liability covers the defense." },
        ],
      } },

    /* 8 ── Technology & Digital Services ── */
    { id: "tech", icon: "ti-code", accent: "#0f6f9c", bg: "#e6f3fa",
      title: "Technology & Digital Services",
      types: ["Software development", "Web design & dev", "IT support & managed services", "App & SaaS", "Network design", "IT staffing & consulting"],
      policies: {
        must: [
          { name: "Technology / professional liability (E&O)", desc: "Covers failures in your work itself — a software bug, a missed deadline, a deliverable that doesn't perform as promised. Tech E&O usually blends professional and cyber wording.", signal: "'What happens to your client if your product breaks or your project runs late?' Any deliverable tied to client revenue or operations is the trigger.", when: "Before the first paid engagement — SaaS and dev shop contracts routinely require it", cross: "For tech firms, E&O and Cyber overlap heavily — buy them together as a combined tech package", claim: "A deployment goes live with a bug that corrupts a client's order database for three days. The client claims $180,000 in lost sales — tech E&O covers the defense and damages." },
          { name: "Cyber liability", desc: "Covers a data breach or ransomware affecting you — or a client whose systems you access or host. For tech firms this is core, not optional.", signal: "They have admin access to client systems, host client data, or build the software clients run their business on.", when: "Day 1 for any tech firm; any firm holding customer data", cross: "A combined tech E&O + cyber form closes the seam where one incident is part service-failure, part data-breach", claim: "Ransomware locks the dev shop's systems along with a client's hosted data; attackers demand $75,000. Cyber pays the negotiation, recovery, and the client's breach-notification costs." },
          { name: "General liability / BOP", desc: "GL covers basic injury and property damage — a client trips at your office, or you damage equipment on site. A BOP bundles that same GL with property and business-income coverage.", signal: "An office, a client visit, or on-site work.", when: "Day 1", cross: "Foundation for Umbrella", claim: "A developer knocks a client's $9,000 server rack off a desk during an on-site install. GL covers the property damage — and the relationship survives." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a work injury — mostly repetitive-strain at the desk, and it follows remote staff to their home office. Required once you have an employee.", signal: "Any W-2 employee, including remote staff.", when: "First employee", cross: "Remote workforces still need it — home-office injuries are compensable", claim: "A remote engineer develops a severe repetitive-strain injury and files a claim from her home office. Workers' comp covers the treatment." },
        ],
        rec: [
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL, Auto, and Workers' Comp — enterprise contracts often demand $5M+.", signal: "Enterprise client contracts demanding higher limits are common in tech procurement.", when: "$1M+ underlying or contractual requirement", cross: "Many enterprise master service agreements dictate the exact limits — read the contract first", claim: "An enterprise MSA requires $5M in liability and a covered loss runs past the $1M primary. The umbrella both satisfies the contract and pays the excess." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — harassment, wrongful termination, discrimination — a real risk in fast-scaling teams.", signal: "5+ employees or rapid headcount growth.", when: "5+ employees", cross: "Pairs with D&O for venture-backed firms", claim: "A fast-scaling startup faces a harassment complaint that becomes a lawsuit. EPLI covers the $80,000 in defense and settlement." },
          { name: "Business income (incl. cyber BI)", desc: "Replaces lost revenue from downtime — including downtime caused by a cyber event, which property-based coverage won't touch.", signal: "Revenue depends on uptime or SaaS availability.", when: "Any revenue model sensitive to outages", cross: "Property BI and Cyber BI are separate triggers — make sure both are addressed", claim: "A ransomware event takes the SaaS platform offline for five days. Cyber business income replaces the subscription revenue lost during the outage." },
        ],
        opt: [
          { name: "Management liability (D&O)", desc: "Protects leadership personally against claims of mismanagement — near-mandatory once outside investors are involved.", signal: "Any venture funding, a board, or priced equity rounds.", when: "After the first outside investment", cross: "VCs frequently require D&O as a term-sheet condition", claim: "After a down round, an investor sues the board over a strategic decision. D&O pays the directors' defense — keeping personal assets out of the fight." },
          { name: "Intellectual property", desc: "Covers patent, trademark, and copyright disputes beyond what media liability handles.", signal: "They hold patents, build novel tech, or operate in a litigious IP space.", when: "Patent-holding or IP-intensive firms", cross: "Standalone IP coverage is specialized — most general policies exclude infringement defense", claim: "A competitor alleges the firm's product infringes its patent and seeks an injunction. IP coverage funds the specialized defense a standard policy excludes." },
          { name: "Hired & non-owned auto", desc: "Covers employees and field techs who drive their own cars to client sites, which personal auto excludes.", signal: "Field/onsite techs or consultants driving their own cars to clients.", when: "Any regular client-site travel", cross: "Cheap backstop that feeds the Umbrella decision", claim: "A field tech rear-ends a car en route to a client site. HNOA covers the claim his personal carrier denies as business use." },
        ],
      } },
    /* 9 ── Creative, Marketing & Media ── */
    { id: "creative", icon: "ti-palette", accent: "#9b2fae", bg: "var(--en-violet-light)",
      title: "Creative, Marketing & Media",
      types: ["Graphic & web design", "Photographers", "Videographers", "Marketing & ad agencies", "PR & social media", "Copywriters & print"],
      policies: {
        must: [
          { name: "Professional liability (E&O)", desc: "Covers failures in your work — a campaign that misses its launch, a deliverable that underperforms, a missed deadline that costs the client revenue.", signal: "They produce deliverables a client relies on or manage spend on a client's behalf. 'What happens if the campaign or project goes wrong?' is the cue.", when: "Before the first paid engagement — agency contracts routinely require it", cross: "GL covers a visitor tripping in the studio; E&O covers the work product and judgment", claim: "An agency's botched ad-platform setup burns through a client's $60,000 media budget with no results. The client sues over the failed work — E&O covers the defense and damages." },
          { name: "Media liability", desc: "Covers copyright, trademark, defamation, and false-advertising claims from the content and campaigns you produce. The signature exposure of this class.", signal: "'Do you create ads, copy, images, video, or campaigns?' Stock images, music, and comparative advertising are classic claim sources.", when: "Any firm producing creative or advertising content", cross: "Often bundled into the E&O form for agencies — confirm it's explicitly scheduled", claim: "An agency uses a stock photo outside its license terms in a national campaign and the photographer's agency demands $50,000. Media liability covers the infringement claim GL won't touch." },
          { name: "General liability / BOP", desc: "GL covers basic injury and property damage — a client trips at your studio, or you damage property on a shoot. A BOP bundles that GL with property and business-income coverage.", signal: "A studio, client visits, or on-location work (shoots, events).", when: "Day 1 — a BOP packages the basics", cross: "Foundation for Umbrella", claim: "A light stand topples during an on-location shoot and damages a client's $7,000 display. GL covers the property damage." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a work injury — desk strains plus lifting and rigging on shoots. Required once you have staff.", signal: "Any W-2 employee, including remote and freelance-converted staff.", when: "First employee", cross: "Production and shoot work raises the hazard above pure desk work", claim: "A videographer strains his back lifting rigging gear on a shoot and needs weeks off. Workers' comp covers the treatment and lost wages." },
        ],
        rec: [
          { name: "Cyber liability", desc: "Covers a data breach for firms running client ad accounts or holding customer lists — including ad-account takeover.", signal: "Managing client ad accounts, CRMs, or stored customer data.", when: "Any firm holding client data or platform credentials", cross: "Ad-account takeover is a fast-growing loss for marketing firms", claim: "A phishing attack hijacks a client's ad account and runs $30,000 of fraudulent spend. Cyber covers the response and the client's loss." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — harassment, wrongful termination, and freelancer misclassification.", signal: "5+ employees or heavy use of contractors/freelancers (classification risk).", when: "5+ employees", cross: "Freelancer misclassification is a common trigger in this class", claim: "A freelancer reclassified as an employee files an unpaid-overtime and misclassification claim. EPLI covers the defense and settlement." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL and Auto — large client contracts and venues often demand it.", signal: "Enterprise clients, large productions, or contracts requiring higher limits.", when: "$1M+ underlying or contractual requirement", cross: "Read the client contract — it usually dictates the required limit", claim: "An on-location production injury produces a judgment above the $1M GL limit. The umbrella covers the excess and satisfies the production contract." },
        ],
        opt: [
          { name: "Inland marine (equipment floater)", desc: "Covers cameras, lenses, lighting, drones, and production gear wherever it goes — places a studio property policy won't reach.", signal: "Photographers and videographers with significant mobile gear.", when: "$15K+ in mobile production equipment", cross: "Separate from any studio property policy", claim: "A camera bag with $20,000 of lenses is stolen from a vehicle on location. The equipment floater replaces it; studio property would deny gear off-premises." },
          { name: "Commercial / hired & non-owned auto", desc: "Covers vehicles and gear traveling to shoots and events, including personal cars used for work.", signal: "Regular travel to shoots/events, or gear transport.", when: "Any owned vehicle or regular shoot travel", cross: "Feeds the Umbrella decision", claim: "A crew member rear-ends a car driving to a shoot. Commercial/HNOA auto covers the claim a personal policy would deny." },
          { name: "Business income", desc: "Replaces lost revenue when a covered event shuts down the studio or production operation.", signal: "Studio- or equipment-dependent operations.", when: "Any operation with a fixed studio or critical gear", cross: "Pairs with Property; consider Cyber BI for platform-dependent firms", claim: "A fire closes the studio for a month mid-production. Business income replaces the lost project revenue and covers fixed costs." },
        ],
      } },

    /* 10 ── Healthcare & Therapy Services (no medical malpractice) ── */
    { id: "health", icon: "ti-stethoscope", accent: "#009284", bg: "var(--en-leaf-light)",
      title: "Healthcare & Therapy Services",
      types: ["Medical & dental offices (non-surgical)", "Chiropractors & PT/OT", "Mental health & counseling", "Optometry & audiology", "Acupuncture & nutrition", "Speech & other therapy"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers non-treatment injuries — a patient slips in the waiting room. A BOP bundles that GL with property and business-income coverage for the practice space.", signal: "A physical practice location with patient and visitor foot traffic.", when: "Day 1 — required by most office leases", cross: "GL covers premises; professional liability covers the treatment act — two separate exposures", claim: "An elderly patient slips on a wet waiting-room floor and fractures a hip — a $60,000 claim. GL responds; the professional policy would not, because no treatment act was involved." },
          { name: "Workers' comp", desc: "Pays a staff member's medical bills and lost wages after a work injury — needlesticks and patient-handling strains are common. Required once you have staff.", signal: "Any clinical or administrative staff. Patient handling and needlesticks are the frequency drivers.", when: "First employee", cross: "Bloodborne-pathogen and lifting exposure makes this higher-hazard than office WC", claim: "A physical therapist injures her back supporting a falling patient and needs months off. Workers' comp covers the medical care and lost time." },
          { name: "Cyber liability / HIPAA", desc: "Covers a breach of patient health records — the response plus HIPAA fines and regulatory defense. Universal for any practice with electronic records.", signal: "They keep electronic health records (all do). Ask about their EHR vendor and Business Associate Agreements.", when: "Universal — any practice with electronic records", cross: "HIPAA fines are a regulatory exposure standard cyber forms may sublimit — confirm regulatory coverage", claim: "A laptop holding unencrypted patient records is stolen, triggering HIPAA notification and a regulatory investigation. Cyber covers the breach response plus $90,000 in fines and defense." },
          { name: "Professional liability (E&O)", desc: "Covers treatment and advice mistakes for allied-health and office practices — a therapy error or a missed referral. (Surgical and physician malpractice is a separate market and excluded here.)", signal: "Any patient-facing treatment or clinical advice. Confirm the form fits their scope and that any high-acuity work is placed in the proper malpractice market.", when: "Before treating the first patient", cross: "GL covers a slip in the lobby; professional liability covers the treatment judgment", claim: "A chiropractor's improper adjustment aggravates a patient's injury and the patient sues for $70,000. Professional liability covers the defense and settlement; GL would deny it." },
        ],
        rec: [
          { name: "Property / equipment", desc: "Covers diagnostic and treatment equipment, build-out, and contents — often a large investment in a leased space.", signal: "Owned imaging, dental, or treatment equipment; build-out in a leased space.", when: "Any practice with significant equipment or tenant improvements", cross: "Add Equipment Breakdown — diagnostic machines fail mechanically, which property won't cover", claim: "A fire damages $120,000 of equipment and the practice's leasehold improvements. Property pays to replace the gear and rebuild the build-out." },
          { name: "Business income", desc: "Replaces lost patient revenue and fixed costs when a covered event closes the practice.", signal: "'How long could you be closed before it threatens the practice?' Equipment-dependent practices are most exposed.", when: "Every practice — confirm period of restoration is realistic", cross: "Pairs with Property; consider Cyber BI for EHR ransomware downtime", claim: "A water-main break floods the clinic and closes it for a month. Business income replaces the lost patient revenue and covers fixed costs." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — discrimination, harassment, and wrongful termination — across clinical and administrative staff.", signal: "5+ employees or a recent HR dispute.", when: "5+ employees", cross: "Bundles with D&O for group practices", claim: "A medical assistant files a discrimination claim after termination. EPLI covers the $55,000 in defense and settlement." },
        ],
        opt: [
          { name: "Abuse & molestation", desc: "Covers defense and liability for abuse or misconduct allegations — a real risk in one-on-one and minor patient contact, and often excluded on base forms.", signal: "One-on-one treatment, minors, or vulnerable populations.", when: "Any practice with private, one-on-one patient contact", cross: "Frequently excluded or sublimited on base forms — confirm it's scheduled", claim: "A counselor faces an abuse allegation. Abuse & molestation coverage funds the defense the base professional and GL forms would exclude." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL (not the treatment/professional layer, which has its own excess).", signal: "High-traffic facilities or contractual limit requirements.", when: "As required by affiliations or risk tolerance", cross: "Confirm whether excess professional liability is needed separately", claim: "A catastrophic slip-and-fall judgment exceeds the $1M GL limit. The umbrella covers the excess over GL — the professional excess is confirmed separately." },
          { name: "Equipment breakdown", desc: "Covers mechanical or electrical failure of imaging, dental, HVAC, and diagnostic equipment — perils property excludes.", signal: "Practices dependent on imaging, dental, or diagnostic machines.", when: "Any practice with significant mechanical equipment", cross: "Property covers fire; breakdown covers the failed compressor or circuit", claim: "A dental practice's sterilizer and compressor fail and halt operations. Equipment breakdown covers the repair and downtime property excludes." },
        ],
      } },

    /* 11 ── Personal Care & Fitness ── */
    { id: "personalcare", icon: "ti-scissors", accent: "#c0246f", bg: "var(--en-rose-50)",
      title: "Personal Care & Fitness",
      types: ["Hair & nail salons", "Barbershops", "Day spas & esthetics", "Waxing & lash studios", "Fitness & yoga studios", "Personal trainers & instructors"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers customer injuries — a slip, a burn from a tool, a gym-equipment accident. A BOP bundles that GL with property coverage for your chairs, stations, equipment, and inventory, plus business income.", signal: "Any client-facing location. Wet floors, hot tools, and equipment are recurring sources; cover chairs, stations, and inventory on the property side.", when: "Before opening — leases require it", cross: "Pair with Professional liability for service errors; add Equipment Breakdown for spa and fitness machines", claim: "A client slips on a wet floor and a fire later destroys $40,000 of stations and inventory — the BOP's GL side covers the injury while its property side replaces the equipment." },
          { name: "Professional liability", desc: "Covers harm from the service itself — a chemical burn, an allergic reaction, a training program that injures a client. Standard GL often excludes service errors.", signal: "'Have you ever had a client react badly to a product, service, or routine?' Color, chemical, lash, and training services are the triggers.", when: "Any service that touches the client's body or health", cross: "GL covers a slip; professional liability covers the service that goes wrong", claim: "A chemical hair treatment causes severe scalp burns and the client sues for $25,000. Professional liability responds where GL's service exclusion would deny it." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a work injury. Booth renters are often wrongly assumed exempt — confirm their classification. Required once you have staff.", signal: "Any staff. 'Are your stylists/trainers W-2, booth renters, or 1099?' separates the obligation.", when: "First employee — confirm booth-renter classification", cross: "Misclassified booth renters are a common WC and EPLI trigger", claim: "A stylist develops a repetitive-strain injury and needs treatment and reduced hours. Workers' comp covers the care and lost wages." },
        ],
        rec: [
          { name: "Product liability", desc: "Covers injury caused by retail products you resell — hair, skin, or supplements. Usually inside GL but confirm the products limit.", signal: "Selling retail products directly to clients.", when: "Any retail product sales", cross: "Usually within GL but confirm the products limit", claim: "A skincare product sold at the spa triggers a severe allergic reaction and the client sues. Product liability covers the defense even though the shop didn't make it." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL — a serious client injury can exceed the primary limit.", signal: "High client volume, multiple locations, or contractual requirements.", when: "$1M+ underlying or high traffic", cross: "Drops over GL — confirm underlying limits meet the minimums", claim: "A gym-equipment accident seriously injures a member and the judgment exceeds the $1M GL limit. The umbrella covers the excess." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wage disputes and discrimination — plus booth-renter misclassification.", signal: "5+ employees, or booth-renter/1099 classification gray areas.", when: "5+ employees", cross: "Booth-renter misclassification is the classic wage-and-hour trigger here", claim: "Stylists classified as renters file a misclassification and unpaid-wage claim. EPLI covers the defense and settlement." },
        ],
        opt: [
          { name: "Cyber liability", desc: "Covers a data breach for studios taking online bookings or storing health-intake forms and payment data.", signal: "Online scheduling, health intake forms, or digital payments.", when: "Any firm holding client data or processing payments online", cross: "Health-intake forms make this more than a payments exposure", claim: "The booking platform is breached, exposing client contact and payment data. Cyber covers notification and the response." },
          { name: "Equipment breakdown", desc: "Covers mechanical or electrical failure of spa, salon, and fitness equipment — perils property excludes.", signal: "Reliance on treadmills, spa systems, or salon equipment.", when: "Any equipment-dependent operation", cross: "Property covers fire; breakdown covers the failed motor or circuit", claim: "A spa's hydrotherapy system and several treadmills fail. Equipment breakdown covers the repair and downtime." },
          { name: "Hired & non-owned auto", desc: "Covers mobile trainers and stylists who drive their own cars to clients, which personal auto excludes.", signal: "Any mobile/on-site service in personal vehicles.", when: "Any regular client-site travel", cross: "Cheap backstop that feeds the Umbrella decision", claim: "A mobile trainer rear-ends a car between client homes. HNOA covers the claim his personal carrier denies as business use." },
        ],
      } },

    /* 12 ── Pet Services ── */
    { id: "pet", icon: "ti-paw", accent: "#b07a0b", bg: "var(--en-yellow-light)",
      title: "Pet Services",
      types: ["Grooming", "Dog walking & pet sitting", "Daycare & boarding", "Dog training", "Veterinary offices", "Pet retail"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers third-party injury and property damage — a bite, a knocked-over passerby, an escaped dog causing an accident. A BOP bundles that GL with property coverage for a facility.", signal: "Any animal handling around people or on client property. Bites and escapes are the recurring sources.", when: "Before the first client — facility leases and contracts require it", cross: "GL covers third-party injury; Animal Bailee covers harm to the animals themselves", claim: "A daycare dog slips its leash, runs into the street, and causes a car accident. GL covers the resulting third-party injury and property damage." },
          { name: "Animal bailee / care, custody & control", desc: "Covers injury, illness, death, or loss of animals in your care — something standard GL excludes. The core gap for grooming, boarding, walking, and daycare.", signal: "'Do animals stay in your care, unsupervised by the owner?' A yes means GL alone leaves a hole — injury or death of a pet in custody is the classic loss.", when: "Anyone holding animals in their care", cross: "The single most-missed coverage in this class — GL's care/custody exclusion surprises clients after a loss", claim: "A boarded dog injures itself badly and needs emergency surgery; another escapes the facility. GL denies both under care/custody — animal bailee pays the vet bills and the loss claim." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a work injury — bites, scratches, and lifting are common. Required once you have staff.", signal: "Any staff handling animals. Bites and lifting are the frequency drivers.", when: "First employee", cross: "Higher hazard than office WC due to bites and animal handling", claim: "A groomer is badly bitten and needs stitches and a course of treatment. Workers' comp covers the medical care and lost time." },
          { name: "Professional liability", desc: "Covers service and treatment mistakes — a grooming injury, a training program that backfires, or veterinary treatment errors (animal, not human, malpractice).", signal: "Grooming, training, or veterinary treatment services where the technique or advice can cause harm.", when: "Any treatment, grooming, or training service", cross: "GL covers a bite to a bystander; professional liability covers the service that injures the animal", claim: "A veterinary treatment error worsens an animal's condition and the owner sues. Professional liability covers the defense and settlement GL would exclude." },
        ],
        rec: [
          { name: "Property / BOP", desc: "Covers the facility, kennels, equipment, and inventory. Bundled with GL it becomes a BOP that can be endorsed to add business income.", signal: "An owned or leased facility with equipment and inventory.", when: "Any fixed location with equipment or stock", cross: "Add Equipment Breakdown for HVAC and refrigeration (medications, food)", claim: "A fire damages the boarding facility and destroys $30,000 of equipment and inventory. Property coverage replaces it." },
          { name: "Commercial / hired & non-owned auto", desc: "Covers mobile grooming and pet-transport vehicles, plus staff driving to clients. Transporting animals adds bailee exposure on the road.", signal: "Mobile grooming, pet transport, or regular driving to client homes.", when: "Any owned vehicle or regular client travel", cross: "Transporting animals adds bailee exposure on the road — confirm it's addressed", claim: "A mobile grooming van is in an at-fault accident. Commercial auto covers the claim a personal policy would deny." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL and Auto — a severe bite or escape claim can exceed the primary limit.", signal: "Facility operations, high animal volume, or contractual requirements.", when: "$1M+ underlying or high volume", cross: "Bite and escape severity drives the umbrella decision", claim: "A serious dog-bite injury produces a judgment above the $1M GL limit. The umbrella covers the excess." },
        ],
        opt: [
          { name: "Cyber liability", desc: "Covers a data breach for firms taking online bookings or storing client and payment records.", signal: "Online scheduling, stored client data, or digital payments.", when: "Any firm holding client data or processing payments online", cross: "Vet practices holding medical and payment records carry the most exposure", claim: "The booking and records system is breached, exposing client payment data. Cyber covers notification and the response." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wage disputes, classification, and wrongful termination.", signal: "5+ employees or 1099/classification gray areas.", when: "5+ employees", cross: "Hourly, high-turnover staffing is the wage-and-hour driver", claim: "A part-time handler files an unpaid-overtime claim. EPLI covers the defense and settlement." },
          { name: "Equipment breakdown", desc: "Covers mechanical failure of HVAC, refrigeration, and facility systems — perils property excludes. An HVAC failure in a kennel is an animal-welfare emergency.", signal: "Facilities dependent on climate control or refrigeration.", when: "Any climate- or refrigeration-dependent facility", cross: "An HVAC failure in a boarding facility is an animal-welfare emergency, not just a repair", claim: "A boarding facility's HVAC fails in a heat wave, endangering the animals and spoiling refrigerated medications. Equipment breakdown covers the repair and loss." },
        ],
      } },
    /* 13 ── Auto Services ── */
    { id: "auto", icon: "ti-car", accent: "#4a4838", bg: "var(--en-warmgrey-light)",
      title: "Auto Services",
      types: ["Mechanical repair", "Body & collision", "Oil change & quick lube", "Tire shops", "Detailing & car wash", "Auto glass & mobile"],
      policies: {
        must: [
          { name: "Garage liability / property (BOP)", desc: "Garage liability is the auto-trade form of GL — it covers injury and property damage from your operations and premises. A garage package bundles it with property coverage for the building, lifts, tools, and parts inventory, plus business income.", signal: "Any shop servicing customer vehicles or with customer traffic. Cover the building, lifts, and parts stock on the property side.", when: "Before opening — leases and the trade require it", cross: "Garage liability covers third parties; Garagekeepers (below) covers the customer's vehicle itself", claim: "A customer slips in the service bay and a fire later damages $200,000 of lifts and equipment — the liability side covers the injury while the property side replaces the equipment." },
          { name: "Garagekeepers (care, custody & control)", desc: "Covers damage to customer vehicles in your care — fire, theft, or accidental damage — which standard GL excludes. The signature gap for repair, body, and storage shops.", signal: "'Do customer vehicles stay overnight or sit in your lot?' A yes means GL alone leaves a hole — fire, theft, or damage to cars in custody is the classic loss.", when: "Anyone holding customer vehicles", cross: "The single most-missed coverage in this class — GL's care/custody exclusion surprises shops after a loss", claim: "An overnight fire in the lot damages eight customer cars awaiting repair. GL denies it under care/custody — garagekeepers pays for the customers' vehicles." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a work injury — lifts, heavy parts, and chemicals make it higher-hazard. Required once you have staff.", signal: "Any shop employee. Lifting, chemicals, and machinery are the frequency drivers.", when: "First employee", cross: "Higher hazard than office WC due to machinery and chemicals", claim: "A technician's hand is crushed by a slipping vehicle on a lift and requires surgery. Workers' comp covers the $80,000 in care and lost time." },
        ],
        rec: [
          { name: "Commercial auto (incl. drive-other-car)", desc: "Covers the shop driving customer and owned vehicles — test drives, road tests, pickups and deliveries — plus tow and service trucks.", signal: "Test drives, road tests, vehicle pickup/delivery, or owned trucks.", when: "Any test-driving or owned vehicle use", cross: "Umbrella over Auto — a test-drive accident is a likely severe loss", claim: "A technician on a road test causes an at-fault accident injuring another driver. Commercial auto responds where a personal policy would deny the business use." },
          { name: "Pollution liability", desc: "Covers pollution claims from waste oil, solvents, and refrigerants — which GL's pollution exclusion leaves out.", signal: "'Where does your waste oil and solvent go?' Any chemical or fluid handling is the trigger.", when: "Any shop handling fluids and chemicals", cross: "GL excludes pollution — a spill or improper disposal claim is uncovered without this", claim: "A waste-oil tank leaks and contaminates the soil, triggering a cleanup order. Pollution liability responds — GL's exclusion would leave the shop exposed." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above Garage Liability and Auto — a test-drive or lift accident can exceed the primary limit.", signal: "Test-driving, high vehicle volume, or contractual requirements.", when: "$1M+ underlying or high volume", cross: "Auto and lift severity drive the umbrella decision", claim: "A test-drive accident produces a judgment above the $1M limit. The umbrella covers the excess." },
        ],
        opt: [
          { name: "Cyber liability", desc: "Covers a data breach for shops storing customer and payment data in a shop-management system.", signal: "Digital scheduling, stored customer data, or card processing.", when: "Any shop holding customer data or processing payments", cross: "Card-present processing is the main breach exposure here", claim: "The shop-management system is breached, exposing customer payment data. Cyber covers notification and the response." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wage disputes (flat-rate pay is a flashpoint), discrimination, and wrongful termination.", signal: "5+ employees or flat-rate/overtime pay disputes.", when: "5+ employees", cross: "Flat-rate pay structures are a common wage-and-hour trigger", claim: "Technicians file an unpaid-overtime claim over flat-rate pay. EPLI covers the defense and settlement." },
          { name: "Equipment breakdown", desc: "Covers mechanical or electrical failure of lifts, compressors, and diagnostic machines — perils property excludes.", signal: "Reliance on lifts, compressors, and diagnostic machines.", when: "Any equipment-dependent shop", cross: "Property covers fire; breakdown covers the failed motor or board", claim: "A shop's main compressor and alignment machine fail and halt operations. Equipment breakdown covers the repair and downtime." },
        ],
      } },

    /* 14 ── Education & Training ── */
    { id: "education", icon: "ti-school", accent: "#0f7fa0", bg: "var(--en-iceblue-light)",
      title: "Education & Training",
      types: ["Tutoring & test prep", "Language & music lessons", "Driving schools", "Trade & vocational schools", "Coding & IT bootcamps", "Corporate training"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers basic injury and property damage — a student trips, or is hurt during hands-on instruction. A BOP bundles that GL with property and business-income coverage for the facility.", signal: "Any physical location or in-person instruction.", when: "Before the first class — facility leases require it", cross: "Foundation for Umbrella; pair with Professional liability for curriculum errors", claim: "A student trips over a cable in a training lab and breaks a wrist — a $20,000 claim. GL covers the premises injury." },
          { name: "Professional liability (E&O)", desc: "Covers teaching and curriculum mistakes — failure to deliver a promised outcome, certification, or job placement.", signal: "They promise outcomes, certifications, or job placement. 'What does the student rely on you to deliver?' is the cue.", when: "Before the first paid program", cross: "GL covers a slip; E&O covers the educational outcome and judgment", claim: "A bootcamp's job-placement guarantee fails for a cohort and students sue over the promised outcome. E&O covers the defense and damages GL would exclude." },
          { name: "Workers' comp", desc: "Pays an instructor's or staff member's medical bills and lost wages after a work injury. Required once you have staff.", signal: "Any instructor or staff. Hands-on trade instruction raises the hazard.", when: "First employee", cross: "Trade and vocational schools carry higher hazard than classroom instruction", claim: "A welding instructor suffers a burn during a demonstration. Workers' comp covers the medical care and lost time." },
          { name: "Abuse & molestation", desc: "Covers defense and liability for abuse or misconduct allegations — a real risk wherever instruction involves minors or one-on-one contact, and often excluded on base forms.", signal: "Working with minors, or any one-on-one instruction (music, tutoring, driving).", when: "Any program involving minors or private instruction", cross: "Frequently excluded or sublimited on base forms — confirm it's scheduled", claim: "A music school faces an abuse allegation involving a minor student. Abuse & molestation coverage funds the defense the base forms would exclude." },
        ],
        rec: [
          { name: "Commercial / hired & non-owned auto", desc: "Covers driving instruction (student drivers) and student transport — a specialized auto exposure that personal auto excludes.", signal: "Driving instruction, student transport, or owned vehicles. Driving schools are a clear must here.", when: "Any owned vehicle, student transport, or driving instruction", cross: "Driving-school student instruction is a specialized auto exposure — confirm the form covers it", claim: "A student driver causes an at-fault accident during a lesson. The driving school's commercial auto covers the claim a personal policy would deny." },
          { name: "Cyber liability", desc: "Covers a data breach of student PII, payment data, and academic records.", signal: "Online enrollment, stored student records, or digital payments.", when: "Any program holding student data online", cross: "Student-record databases are a meaningful breach target", claim: "The enrollment system is breached, exposing student PII and payment data. Cyber covers notification and the response." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL and Auto — student injury or a driving-school accident can exceed the primary limit.", signal: "Driving instruction, hands-on trade work, or contractual requirements.", when: "$1M+ underlying or contractual requirement", cross: "Auto and hands-on hazards drive the umbrella decision", claim: "A driving-lesson accident produces a judgment above the $1M auto limit. The umbrella covers the excess." },
        ],
        opt: [
          { name: "Property / BOP", desc: "Covers the facility, classroom and lab equipment, and computers. Bundled with GL it becomes a BOP that can be endorsed to add business income.", signal: "An owned or built-out facility with equipment.", when: "Any fixed location with equipment", cross: "Add Equipment Breakdown for lab and computer-dependent programs", claim: "A fire damages a coding bootcamp's lab and $40,000 of computers. Property coverage replaces it." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wage disputes, discrimination, and instructor misclassification.", signal: "5+ employees or contractor/instructor classification gray areas.", when: "5+ employees", cross: "Adjunct/contractor classification is a common trigger", claim: "An adjunct instructor reclassified as an employee files a wage claim. EPLI covers the defense and settlement." },
          { name: "Business income", desc: "Replaces lost tuition revenue and fixed costs when a covered event closes the facility mid-term.", signal: "Facility-dependent programs with enrolled, paying cohorts.", when: "Any program with a fixed facility and enrolled students", cross: "Pairs with Property", claim: "A flood closes the school for six weeks mid-term. Business income replaces the lost tuition revenue and covers fixed costs." },
        ],
      } },

    /* 15 ── Entertainment & Events ── */
    { id: "events", icon: "ti-confetti", accent: "#d4651a", bg: "var(--en-orange-light)",
      title: "Entertainment & Events",
      types: ["Event & wedding planners", "DJs & musicians", "Photo booth & party rental", "Corporate event production", "Conference services", "Theatrical (limited)"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers injury and property damage at events — a hurt guest, toppled equipment, venue damage. A BOP bundles that GL with property coverage for an office or warehouse.", signal: "Any event, performance, or setup around the public. Venue contracts requiring a certificate are the cue.", when: "Before the first event — venues require it as a condition of entry", cross: "Foundation for Umbrella; pair with Inland Marine for the gear", claim: "A speaker stack topples at an event and injures a guest — a $50,000 claim. GL covers the third-party injury, and the certificate satisfied the venue." },
          { name: "Professional liability (E&O)", desc: "Covers planning and execution mistakes — a botched timeline, a no-show vendor, an error that ruins an irreplaceable event like a wedding.", signal: "They plan, coordinate, or are responsible for an event's execution. 'What happens if the event goes wrong?' is the cue — weddings can't be re-run.", when: "Before the first planned event", cross: "GL covers a guest injury; E&O covers the planning failure that ruins the event", claim: "A planner books the wrong date and a wedding party is left without a venue. The couple sues over the irreplaceable event — E&O covers the defense and damages GL would exclude." },
          { name: "Workers' comp", desc: "Pays a crew member's medical bills and lost wages after a work injury — setup, rigging, and load-in are common. Required once you have staff.", signal: "Any crew or staff. Rigging and load-in are the frequency drivers.", when: "First employee", cross: "Physical setup work raises the hazard above office work", claim: "A crew member is injured during a load-in lifting heavy staging. Workers' comp covers the treatment and lost time." },
          { name: "Inland marine (equipment floater)", desc: "Covers sound, lighting, staging, and rental gear wherever it goes — places a warehouse property policy won't reach.", signal: "DJs, production crews, and rental operators with significant mobile gear.", when: "$10K+ in mobile event equipment", cross: "Separate from any warehouse property policy", claim: "A trailer of DJ and lighting gear — $25,000 worth — is stolen from a hotel lot overnight. The equipment floater replaces it; warehouse property would deny gear off-site." },
        ],
        rec: [
          { name: "Liquor liability (host)", desc: "If your events serve or host alcohol, this covers claims tied to an intoxicated guest — including harm they cause after leaving. GL excludes liquor for those involved in service.", signal: "'Do your events serve or host alcohol?' Receptions, weddings, and corporate events usually do.", when: "Any event involving alcohol service", cross: "GL excludes liquor — Umbrella sits over this", claim: "A guest over-served at an event causes a crash on the way home and the host is named. Host liquor liability covers the dram-shop claim GL excludes." },
          { name: "Commercial / hired & non-owned auto", desc: "Covers crews and gear traveling between venues, including personal cars used for work.", signal: "Regular travel between venues, or gear transport.", when: "Any owned vehicle or regular event travel", cross: "Feeds the Umbrella decision", claim: "A crew member rear-ends a car hauling gear to a venue. Commercial/HNOA auto covers the claim a personal policy would deny." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL, Liquor, and Auto — a crowd injury or alcohol-related loss can far exceed the primary limit.", signal: "Large events, alcohol service, or venue-mandated limits.", when: "$1M+ underlying or venue requirement", cross: "Venues often dictate the required limit — read the contract", claim: "A crowd-surge injury at a large event produces a $3M judgment. The umbrella covers everything above the $1M GL limit." },
        ],
        opt: [
          { name: "Event cancellation", desc: "Covers lost deposits and non-refundable costs when an event is cancelled or postponed by a covered peril — weather, venue loss, key-person illness.", signal: "Operators carrying significant non-refundable deposits and vendor commitments.", when: "Any event with large non-refundable outlays", cross: "Different trigger from liability — protects the money, not third parties", claim: "A storm forces a major outdoor event to cancel and $40,000 in non-refundable deposits is lost. Event cancellation reimburses the costs." },
          { name: "Property / BOP", desc: "Covers an owned office, warehouse, and stored gear. Bundled with GL it becomes a BOP that can be endorsed to add business income.", signal: "An owned office or warehouse with stored gear.", when: "Any fixed location with stored equipment", cross: "Add an equipment floater for gear that travels", claim: "A fire in the equipment warehouse destroys $30,000 of staging and inventory. Property coverage replaces what was on-premises." },
          { name: "Employment practices (EPLI)", desc: "Covers claims from employees — wage disputes and misclassification — common with seasonal and contractor crews.", signal: "5+ employees or heavy contractor use.", when: "5+ employees", cross: "Seasonal and contractor staffing is the classification trigger", claim: "A seasonal crew member files a misclassification and wage claim. EPLI covers the defense and settlement." },
          { name: "Cyber liability", desc: "Covers the cost of a data breach for operators collecting attendee registration, ticketing, and payment data.", signal: "Online registration or ticketing, or stored attendee and payment data.", when: "Any operator running registration, ticketing, or payments online", cross: "Attendee and ticketing databases are a real breach target for events", claim: "An event-registration platform is breached, exposing attendee contact and payment data. Cyber covers notification and the response." },
        ],
      } },

    /* 16 ── Light Manufacturing & Wholesale Distribution ── */
    { id: "manufacturing", icon: "ti-building-factory-2", accent: "#246b8f", bg: "#e6f3fa",
      title: "Light Manufacturing & Wholesale Distribution",
      types: ["Metal fab & light assembly", "Plastics & apparel", "Printing & signage", "Promo products & embroidery", "Wholesale & distribution", "E-commerce fulfillment"],
      policies: {
        must: [
          { name: "General liability / BOP", desc: "GL covers premises injuries and basic operations liability. A BOP bundles that GL with property coverage for the building, machinery, raw materials, and finished goods, plus business income — set limits to peak inventory and full replacement.", signal: "Any production or distribution operation with a building, machinery, and stock. Set property limits to peak values.", when: "Before the first product ships — buyers and distributors require it", cross: "Products liability sits alongside on its own limit (see below); pair the property side with business income", claim: "A fire destroys $500,000 of machinery and finished goods and a visitor is hurt at the dock — the BOP's property side pays the replacement while its GL side covers the injury." },
          { name: "Product liability", desc: "Covers injury or property damage caused by products you make or distribute — defects, contamination, failure to warn. The signature severity exposure of the class.", signal: "Making or distributing any physical product. Imported or private-label goods raise it further.", when: "Any manufacturing or distribution operation", cross: "As manufacturer or distributor you sit at the center of the liability chain — confirm an adequate dedicated limit", claim: "A fabricated bracket fails and causes a serious injury downstream; the claim reaches $400,000. Product liability covers the defense and damages a sublimited GL could not." },
          { name: "Workers' comp", desc: "Pays an employee's medical bills and lost wages after a work injury — machinery, lifting, and forklifts make it higher-hazard. Required once you have staff.", signal: "Any production or warehouse staff. Machinery and forklifts are the frequency drivers.", when: "First employee", cross: "Machinery and forklift exposure makes this higher-hazard than office WC", claim: "A press operator's hand is caught in a machine and requires surgery. Workers' comp covers the $110,000 in care and lost time, and machine-guarding becomes part of the loss-control conversation." },
        ],
        rec: [
          { name: "Commercial auto", desc: "Covers delivery and distribution vehicles moving goods between facilities and to customers. Personal auto excludes business use.", signal: "Any owned delivery truck or distribution fleet. Drivers in personal vehicles = add HNOA.", when: "Any owned vehicle or distribution operation", cross: "Umbrella over Auto — a loaded delivery-truck accident is a likely severe loss", claim: "A delivery truck causes an at-fault accident injuring two people; the claim reaches $1.4M. Commercial auto responds where a personal policy would deny the business use." },
          { name: "Inland marine (goods in transit / stock)", desc: "Covers raw materials and finished goods in transit or stored off-site — places a building-based property policy won't reach.", signal: "Shipping goods between facilities, using third-party fulfillment, or holding off-site stock.", when: "Any operation moving or storing goods off-premises", cross: "Property covers goods on-premises; inland marine covers them in transit and off-site", claim: "A shipment of finished goods worth $35,000 is damaged in transit between facilities. Inland marine covers the loss property would deny off-premises." },
          { name: "Umbrella / excess", desc: "Adds an extra layer of liability limit above GL, products, and Auto — product and fleet claims routinely exceed the primary limit.", signal: "Significant product distribution, a delivery fleet, or buyer-mandated limits.", when: "$1M+ underlying or contractual requirement", cross: "Product and auto severity drive the umbrella decision; large buyers often dictate limits", claim: "A product-failure judgment exceeds the $1M products limit. The umbrella covers the excess and satisfies the buyer's contract requirement." },
        ],
        opt: [
          { name: "Equipment breakdown", desc: "Covers mechanical or electrical failure of production machinery, presses, and HVAC — perils standard property excludes.", signal: "Reliance on production machinery or climate/refrigeration control.", when: "Any machinery-dependent operation", cross: "Property covers fire; breakdown covers the failed motor, board, or compressor", claim: "A main production press fails and halts the line for a week. Equipment breakdown covers the repair and the resulting downtime property excludes." },
          { name: "Pollution liability", desc: "Covers pollution claims from solvents, inks, chemicals, fuels, and waste — which GL's pollution exclusion leaves out.", signal: "Any chemical, ink, solvent, or fuel handling and disposal.", when: "Any operation handling chemicals or generating waste", cross: "GL excludes pollution — a spill or disposal claim is uncovered without this", claim: "A solvent spill at a printing operation contaminates the site and triggers a cleanup order. Pollution liability responds — GL's exclusion would leave it uncovered." },
          { name: "Cyber liability", desc: "Covers a breach or ransomware affecting order systems and networked production equipment — which can halt operations.", signal: "Online ordering, stored customer data, or networked production systems.", when: "Any operation holding customer data or running networked systems", cross: "Ransomware that halts production is both a data and a business-interruption loss", claim: "Ransomware locks the order-management system and halts shipping for days. Cyber covers the response and the business interruption." },
        ],
      } },
  ];

  /* ── Objection deck ── */
  const OBJECTIONS = [
    { title: "Your price is too high", icon: "ti-currency-dollar", category: "Price",
      root: "Price is an outcome, not the real objection. They're weighing the premium in isolation, not against what it protects.",
      reframe: "\"I hear you, nobody wants to overpay. Quick question though: is it high versus another quote, or high versus what you budgeted?\" Then reframe to total cost of risk.",
      bridge: "What would one uncovered claim cost you out of pocket? That's the number the premium is really competing against." },
    { title: "Let me think about it", icon: "ti-clock", category: "Stall",
      root: "Usually an unspoken concern, not a real need for time. One piece isn't sitting right.",
      reframe: "\"Of course, it's your business. Usually when someone wants to think it over, there's one piece that isn't settled. What's the part you want to think through?\"",
      bridge: "Is it the coverage, the price, or just timing? If we name it now I can probably answer it on this call." },
    { title: "I already have an agent, I'm happy", icon: "ti-shield-check", category: "Incumbent",
      root: "Loyalty or inertia. Being happy doesn't mean being well covered or recently reviewed.",
      reframe: "\"That's great, a good agent is worth keeping and I'm not here to replace anyone. A lot of owners find a second set of eyes useful, no obligation. Worst case, you confirm you're in good shape.\"",
      bridge: "When was the last time someone actually reviewed your coverage against how your business has changed?" },
    { title: "I just need Workers' Comp, nothing else", icon: "ti-package", category: "Cross-sell",
      root: "They came for one product and see you as an order-taker. This is the advisory gap, and the moment to fill it.",
      reframe: "\"Got it, we'll get your Workers' Comp handled today. While I have you, I'd be doing you a disservice not to flag this: businesses like yours almost always have one or two gaps WC doesn't cover. Two minutes to check, and if you're covered, great.\"",
      bridge: "Can I ask you two quick questions about how your business runs, just so I'm not leaving you exposed?" },
    { title: "I found it cheaper somewhere else", icon: "ti-arrows-left-right", category: "Price",
      root: "Almost always an apples-to-oranges comparison: different limits, deductibles, or a coverage that's quietly missing.",
      reframe: "\"That's worth a look. Cheaper usually means something is different, not the same thing for less. Send me what they quoted and I'll line them up side by side.\"",
      bridge: "If I show you exactly where the coverage differs, would price still be the deciding factor?" },
    { title: "Just email me the quote", icon: "ti-mail", category: "Stall",
      root: "Deflecting to the lowest-commitment channel. Email is where quotes go to sit unread.",
      reframe: "\"Happy to send it so you have it in writing. These have a few moving parts though, and I'd hate for questions to sit in your inbox. Give me five minutes to walk you through it and I'll send it right after.\"",
      bridge: "What's the best number to reach you on so I can answer anything live?" },
    { title: "I've never heard of NEXT", icon: "ti-help-circle", category: "Trust",
      root: "Brand unfamiliarity. Easily answered with the financial-strength story most owners don't expect.",
      reframe: "\"Fair question, I'd want to know too. ERGO NEXT is backed by Munich Re, one of the largest reinsurers in the world, and we hold an A+ Superior rating from AM Best. Digital-first experience, institutional balance sheet behind it.\"",
      bridge: "Does knowing there's that kind of backing behind the policy change how you're weighing it?" },
    { title: "My business is too small for all that", icon: "ti-building-store", category: "Cross-sell",
      root: "Belief that small equals safe. Often the most exposed, because one claim can end a small operation.",
      reframe: "\"I hear that a lot, and I'd flip it. A big company can absorb a lawsuit. A business your size, one uncovered claim can be the whole thing. The coverage isn't because you're big, it's because you can't afford the hit.\"",
      bridge: "If a customer slipped and sued tomorrow, would the business survive paying that out of pocket?" },
    { title: "I just want the cheapest option", icon: "ti-tag", category: "Price",
      root: "They don't yet see the gap between price and protection. Often a first-time buyer treating insurance as a checkbox.",
      reframe: "\"Fair, and I'll always show you the most competitive option. My job is to make sure cheap doesn't turn into a claim that isn't covered. Cheapest and right aren't always the same.\"",
      bridge: "If the cheapest policy left a gap right where your business is most exposed, would you still want it?" },
    { title: "Now's not a good time", icon: "ti-calendar", category: "Stall",
      root: "Could be genuine, could be a soft brush-off. Respect it, but anchor the next step before hanging up.",
      reframe: "\"Completely understand, you're running a business and I don't want to add to the pile. When's a better window, today or tomorrow? I'll keep it to ten minutes.\"",
      bridge: "Would mid-morning or end of day work better for you?" },
    { title: "I've been with them for 20 years", icon: "ti-heart-handshake", category: "Incumbent",
      root: "Loyalty hardened into inertia. Two decades of habit makes switching feel like a betrayal — or just a hassle they'd rather avoid.",
      reframe: "\"That kind of loyalty says a lot about you, and I respect it. Twenty years is also a long time for a business to change while a policy quietly stays the same. I'm not asking you to leave anyone — just to let me confirm what you bought back then still fits what you do today.\"",
      bridge: "Has anyone actually re-reviewed that policy against your business in the last few years, or has it just renewed on autopilot?" },
    { title: "Doesn't my BOP already cover all that?", icon: "ti-stack-2", category: "Cross-sell",
      root: "They assume a packaged policy is a complete one. A BOP bundles the basics well, but the gaps it leaves are often exactly where the business is most exposed.",
      reframe: "\"Good instinct — a BOP does bundle a lot, which is why it's a great base. But it's built to be broad, not complete. The vehicles you drive, the data you hold, your professional advice — those usually sit outside it. Let me show you the edges.\"",
      bridge: "Can I walk you through the three things a BOP almost never includes, so you know exactly where you stand?" },
    { title: "Money's tight right now", icon: "ti-receipt", category: "Price",
      root: "A cash-flow concern, not a coverage rejection. They want the protection — it's the timing and size of the spend that worries them.",
      reframe: "\"Totally fair, cash flow is real and I'd never tell you to overextend. Let's separate the two: is it the coverage you're unsure about, or just how the payment lands? We have monthly options that keep it manageable instead of one big hit.\"",
      bridge: "If we spread this into payments that actually fit your month, would the coverage itself work for you?" },
    { title: "I need to talk to my partner first", icon: "ti-users", category: "Stall",
      root: "May be real, may be a stall. Either way, equip them to have the conversation instead of leaving it to chance.",
      reframe: "\"Makes sense, a decision like this should be shared. Let me make it easy: what's the main thing they'll want to know? Let me give you the two-sentence version you can take to them.\"",
      bridge: "Would it help if I hopped on a quick call with both of you so nothing gets lost in translation?" },
    { title: "I don't want to do this over the phone", icon: "ti-phone-off", category: "Trust",
      root: "Prefers digital, or wary of pressure. Meet them where they are without surrendering the rapport a call builds.",
      reframe: "\"No problem, we can do as much as you want digitally, including signing by text. Most folks just like a quick call so nothing gets missed, since that's where the costly mistakes hide. Whatever is easiest for you.\"",
      bridge: "Want me to text you the quote now so you can call me with any questions?" },
    { title: "I'll add the rest later", icon: "ti-arrows-shuffle", category: "Cross-sell",
      root: "Deferral, not refusal. 'Later' rarely comes on its own, and the gap stays wide open until a claim closes it the hard way.",
      reframe: "\"Makes sense to phase it, and we can. The catch is the exposure doesn't wait for 'later' — a claim shows up on its own schedule. If we at least lock down the highest-risk gap now, you're protected where it counts while we stage the rest.\"",
      bridge: "Of the gaps we found, which one would hurt the most if it happened next week? Let's start there." },
  ];

  /* ── Vertical-risk deck — same 16 classes as the COB Trainer ── */
  const VERTICALS = [
    { title: "Artisan Contractors", icon: "ti-tools", category: "Workers' Comp", tagline: "Multi-trade crews, job-site exposure",
      products: [
        { name: "General Liability", why: "Third-party property damage on client job sites is a near-certainty over time.", pivot: "Do your crews work inside client homes or commercial properties?", listen: "\"We're in someone's house every day\" or any mention of finished surfaces, fixtures, or callbacks." },
        { name: "Tools & Equipment", why: "Stolen or damaged tools on site mean lost revenue and missed deadlines.", pivot: "What's the total replacement value of the tools and equipment on your trucks?", listen: "\"My whole setup is in the van\" or a trailer left loaded overnight." },
        { name: "Hired/Non-Owned Auto", why: "Crew using personal vehicles to job sites creates an uncovered liability gap.", pivot: "Do any of your crew use their own trucks to get to job sites?", listen: "\"The guys just meet me there\" or no company vehicles but a multi-person crew." },
        { name: "Umbrella", why: "Most GC contracts require $2M+ — standard limits won't satisfy the requirement.", pivot: "Have any GCs or clients required you to carry higher coverage limits?", listen: "\"They asked for a certificate\" or mention of bidding on bigger commercial jobs." } ] },
    { title: "Cleaning & Janitorial Services", icon: "ti-spray", category: "General Liability", tagline: "Inside client property, keys in hand",
      products: [
        { name: "Care, Custody & Control", why: "GL excludes damage to property in your care — exactly where cleaners operate.", pivot: "Do you hold keys or alarm codes, or work inside client space unsupervised?", listen: "\"We have the master key\" or after-hours access to a building." },
        { name: "Janitorial Bond", why: "Commercial clients require bonding to protect against employee theft.", pivot: "Do any of your clients require your team to be bonded?", listen: "\"The contract said we had to be bonded\" or bidding on office contracts." },
        { name: "Hired/Non-Owned Auto", why: "Crews driving personal vehicles between sites is an uncovered exposure.", pivot: "How do your cleaners travel between jobs — personal or company vehicles?", listen: "\"They drive their own cars\" or multiple sites serviced per day." },
        { name: "Pollution", why: "Mold, sewage, and heavy chemical work fall in GL's pollution exclusion.", pivot: "Do you do any mold, water-damage, or hazmat cleanup?", listen: "\"We handle the tough jobs\" or remediation and restoration work." } ] },
    { title: "Landscaping & Lawn Care", icon: "ti-plant-2", category: "Workers' Comp", tagline: "Equipment-heavy, outdoor exposure",
      products: [
        { name: "Pollution", why: "Chemical application and drift onto neighboring property is almost always uncovered.", pivot: "Do you apply herbicides, pesticides, or fertilizer?", listen: "\"We treat lawns\" or any mention of spraying or chemical programs." },
        { name: "Tools & Equipment", why: "Mowers, blowers, and trailers are high-value theft targets on open sites.", pivot: "Do you leave equipment on trailers overnight or at job sites?", listen: "\"It all stays on the trailer\" or equipment stored off a secured lot." },
        { name: "Commercial Auto", why: "Trucks towing equipment trailers need commercial-grade coverage.", pivot: "Are your trucks titled to the business, and do you tow trailers?", listen: "\"We haul the trailer everywhere\" or heavy loads on the highway." },
        { name: "Snow/Ice Ops", why: "Winter slip-and-fall on serviced lots is a severe seasonal liability.", pivot: "Do you plow or de-ice in the winter?", listen: "\"We do snow to stay busy year-round\" or seasonal contracts." } ] },
    { title: "Food Service & Hospitality", icon: "ti-tools-kitchen-2", category: "BOP", tagline: "Slip/fall, food liability, alcohol risk",
      products: [
        { name: "Liquor Liability", why: "Serving alcohol without it leaves uninsured dram-shop exposure.", pivot: "Do you serve, sell, or allow alcohol anywhere on premises?", listen: "\"We have a bar\" or beer/wine service, BYOB, or catered events." },
        { name: "Business Income", why: "Thin margins mean even a few weeks closed can be fatal.", pivot: "If your kitchen went down for a month, could you cover rent and payroll?", listen: "\"We'd be in trouble fast\" or no cash cushion for downtime." },
        { name: "Equipment Breakdown", why: "A failed compressor spoils inventory — and property won't cover the failure.", pivot: "How dependent are you on refrigeration and cooking equipment?", listen: "\"If the walk-in dies we lose everything\" or aging equipment." },
        { name: "Cyber", why: "POS systems hold customer card data — a breach is expensive and regulated.", pivot: "Do you process customer payments digitally at the register?", listen: "\"Everyone taps to pay now\" or a loyalty app collecting data." } ] },
    { title: "Retail Trade", icon: "ti-building-store", category: "BOP", tagline: "Inventory + customer foot traffic",
      products: [
        { name: "Business Income", why: "A burst pipe or fire can close the store while rent and payroll keep running.", pivot: "If you were closed for a month, could you cover your fixed costs?", listen: "\"We live month to month\" or a single location with no backup." },
        { name: "Crime / Theft", why: "Employee theft and shrinkage are a real, recurring loss for retail.", pivot: "Do you handle cash, or carry high-value inventory?", listen: "\"Stuff goes missing\" or cash drawers and jewelry/electronics stock." },
        { name: "Cyber", why: "POS and e-commerce systems hold customer payment data.", pivot: "Do you sell online or process cards in-store?", listen: "\"We just launched a website\" or any card-present processing." },
        { name: "Product Liability", why: "As the seller, you're in the liability chain even for goods you didn't make.", pivot: "Are you sourcing product from overseas or private-label manufacturers?", listen: "\"We import a lot of it\" or selling consumables and children's items." } ] },
    { title: "Real Estate & Habitational", icon: "ti-building-skyscraper", category: "Professional Liability", tagline: "Transaction advice + fiduciary exposure",
      products: [
        { name: "Cyber", why: "Wire-transfer fraud is the #1 cyber loss in real estate.", pivot: "Do you send or receive wire instructions for closings by email?", listen: "\"We email the closing details\" or handling buyer funds." },
        { name: "Crime / Fidelity", why: "Managers holding rents, deposits, and reserves face theft and fraud exposure.", pivot: "Do you collect or hold tenant rents and security deposits?", listen: "\"We manage the owner's money\" or signatory authority on accounts." },
        { name: "General Liability", why: "Open houses and property visits create on-site injury exposure.", pivot: "Do you host open houses or show properties on behalf of clients?", listen: "\"We're at properties all the time\" or managing physical buildings." },
        { name: "Management Liability (D&O)", why: "Serving or managing HOA/condo boards exposes governance decisions.", pivot: "Do you manage or advise any HOA or condo association boards?", listen: "\"We handle the association\" or special-assessment disputes." } ] },
    { title: "Professional & Financial Services", icon: "ti-briefcase", category: "Professional Liability", tagline: "Advice-driven, data-exposed",
      products: [
        { name: "Cyber", why: "These firms hold tax records, SSNs, and bank details — prime breach targets.", pivot: "Where do you store client financial and personal data?", listen: "\"It's all in the cloud\" or wire instructions sent over email." },
        { name: "Crime / Fidelity", why: "Bookkeepers with access to client accounts are squarely exposed to theft and fraud.", pivot: "Do you handle client money, sign checks, or access client accounts?", listen: "\"We pay their bills for them\" or login access to client banking." },
        { name: "Hired/Non-Owned Auto", why: "Consultants driving to clients in personal cars have an uncovered gap.", pivot: "How often is your team driving to clients?", listen: "\"We're on the road to clients constantly\" or no company vehicles." },
        { name: "EPLI", why: "Knowledge workers litigate employment disputes readily.", pivot: "How many employees do you have, and where are you located?", listen: "\"We had a tough termination recently\" or 5+ staff in CA/NY/NJ/IL." } ] },
    { title: "Technology & Digital Services", icon: "ti-code", category: "Professional Liability", tagline: "Deliverables + client systems access",
      products: [
        { name: "Tech E&O", why: "A failed deployment or missed SLA can trigger a direct client lawsuit.", pivot: "Do your contracts include performance guarantees or uptime requirements?", listen: "\"We have an SLA\" or projects tied to client revenue or operations." },
        { name: "Cyber", why: "Access to client systems makes you responsible when a client is breached through you.", pivot: "Do you have admin access to client networks, data, or hosted systems?", listen: "\"We manage their whole stack\" or hosting client data." },
        { name: "Umbrella", why: "Enterprise contracts routinely demand $5M+ in liability limits.", pivot: "Do any enterprise clients require higher liability limits to sign?", listen: "\"Their procurement team had requirements\" or an MSA on the table." },
        { name: "EPLI", why: "Fast-scaling, culture-driven workplaces generate employment claims.", pivot: "How large is your team, and how fast are you hiring?", listen: "\"We're growing really fast\" or recent headcount surges." } ] },
    { title: "Creative, Marketing & Media", icon: "ti-palette", category: "Professional Liability", tagline: "Published content + campaign spend",
      products: [
        { name: "Media Liability", why: "Copyright, trademark, and defamation claims from content are routine.", pivot: "Do you create ads, copy, images, or video for clients?", listen: "\"We use a lot of stock\" or comparative advertising and licensed music." },
        { name: "Cyber", why: "Running client ad accounts and holding customer lists carries breach risk.", pivot: "Do you manage client ad accounts or store their customer data?", listen: "\"We run their whole social\" or CRM and ad-platform logins." },
        { name: "Equipment Floater", why: "Cameras, lenses, and production gear are high-value and constantly mobile.", pivot: "What's your production gear worth, and does it travel to shoots?", listen: "\"My kit is worth more than my car\" or gear stored in vehicles." },
        { name: "Umbrella", why: "Large productions and enterprise contracts often demand higher limits.", pivot: "Do your client contracts or venues require higher liability limits?", listen: "\"The venue needed a certificate\" or on-location production work." } ] },
    { title: "Healthcare & Therapy Services", icon: "ti-stethoscope", category: "General Liability", tagline: "Patient contact + protected health data",
      products: [
        { name: "Cyber / HIPAA", why: "PHI is among the most regulated data — a breach triggers HIPAA penalties.", pivot: "Do you keep electronic health records, and who's your EHR vendor?", listen: "\"Everything's in the EHR\" or unencrypted laptops with patient data." },
        { name: "Professional Liability", why: "Treatment and advice errors create direct liability (non-surgical scope).", pivot: "What hands-on treatment or clinical advice do you provide?", listen: "\"We adjust / treat / counsel patients\" or any one-on-one care." },
        { name: "Abuse & Molestation", why: "One-on-one and minor patient contact is a real, often-excluded exposure.", pivot: "Do you treat minors or see patients one-on-one in private?", listen: "\"It's just me and the patient\" or pediatric or counseling work." },
        { name: "Business Income", why: "Patient revenue stops the day a covered event closes the doors.", pivot: "How long could you stay closed before it threatens the practice?", listen: "\"We couldn't survive long closed\" or heavy equipment dependence." } ] },
    { title: "Personal Care & Fitness", icon: "ti-scissors", category: "General Liability", tagline: "Physical service + client injury risk",
      products: [
        { name: "Professional Liability", why: "Chemical burns, reactions, and service errors are direct malpractice claims.", pivot: "Have you ever had a client react badly to a product or service?", listen: "\"Someone had a reaction once\" or color, chemical, lash, or training work." },
        { name: "Workers' Comp", why: "Booth renters often assume they're exempt — they frequently are not.", pivot: "Are your stylists or trainers W-2, booth renters, or 1099?", listen: "\"They rent their chairs\" or any classification gray area." },
        { name: "Product Liability", why: "Reselling retail products exposes the owner if a product harms a client.", pivot: "Do you sell retail hair, skin, or supplement products to clients?", listen: "\"We sell product at the front\" or a retail shelf in the studio." },
        { name: "Cyber", why: "Online booking and health-intake forms carry breach exposure.", pivot: "Do you take bookings online or collect health intake forms?", listen: "\"They book through the app\" or stored intake and payment data." } ] },
    { title: "Pet Services", icon: "ti-paw", category: "General Liability", tagline: "Animals in your care + bite risk",
      products: [
        { name: "Animal Bailee", why: "GL excludes injury, illness, or death of animals in your care — the core gap.", pivot: "Do animals stay in your care unsupervised by the owner?", listen: "\"We board / groom / daycare\" or pets held overnight or off-leash." },
        { name: "Professional Liability", why: "Grooming, training, or veterinary treatment errors create direct claims.", pivot: "Do you groom, train, or provide veterinary treatment?", listen: "\"We do the full service\" or technique- or advice-driven care." },
        { name: "Commercial Auto", why: "Mobile grooming and pet transport carry on-the-road and bailee exposure.", pivot: "Do you transport animals or run a mobile grooming van?", listen: "\"We pick the dogs up\" or animals riding in business vehicles." },
        { name: "Workers' Comp", why: "Bites, scratches, and lifting injuries make handling a high-frequency risk.", pivot: "Do you have staff handling animals day to day?", listen: "\"Someone always gets nipped\" or any employees in the kennel." } ] },
    { title: "Auto Services", icon: "ti-car", category: "Commercial Auto", tagline: "Customer vehicles in your custody",
      products: [
        { name: "Garagekeepers", why: "GL excludes damage to customer vehicles in your care — the signature gap.", pivot: "Do customer vehicles stay overnight or sit in your lot?", listen: "\"Cars are here for days\" or a lot full of customer vehicles." },
        { name: "Commercial Auto", why: "Test drives and vehicle pickups create owned- and non-owned-auto exposure.", pivot: "Do your techs test-drive or pick up and deliver customer cars?", listen: "\"We road-test everything\" or shuttle and pickup services." },
        { name: "Pollution", why: "Waste oil, solvents, and refrigerants fall in GL's pollution exclusion.", pivot: "Where does your waste oil and solvent go?", listen: "\"We've got drums out back\" or any fluid handling and disposal." },
        { name: "Equipment Breakdown", why: "Lifts, compressors, and diagnostics fail mechanically — property won't cover it.", pivot: "How much of your shop runs on lifts and diagnostic machines?", listen: "\"If the compressor dies we stop\" or aging shop equipment." } ] },
    { title: "Education & Training", icon: "ti-school", category: "Professional Liability", tagline: "Promised outcomes + minors in your care",
      products: [
        { name: "Professional Liability (E&O)", why: "Failed outcomes, certifications, or placement promises trigger lawsuits.", pivot: "Do you promise certifications, outcomes, or job placement?", listen: "\"We guarantee placement\" or accreditation and outcome claims." },
        { name: "Abuse & Molestation", why: "Working with minors or one-on-one instruction is a real, often-excluded risk.", pivot: "Do you work with minors or teach one-on-one?", listen: "\"It's private lessons\" or any program involving children." },
        { name: "Commercial Auto", why: "Driving schools and student transport carry specialized auto exposure.", pivot: "Do you provide driving instruction or transport students?", listen: "\"We teach behind the wheel\" or vans moving students." },
        { name: "Cyber", why: "Student PII, payment data, and records are a meaningful breach target.", pivot: "Do you enroll students online or store academic records?", listen: "\"It's all in our portal\" or stored student data and payments." } ] },
    { title: "Entertainment & Events", icon: "ti-confetti", category: "General Liability", tagline: "Crowds, alcohol, and high-value gear",
      products: [
        { name: "Professional Liability (E&O)", why: "A planning error can ruin an irreplaceable event — weddings can't be re-run.", pivot: "Are you responsible for planning or executing the event itself?", listen: "\"We run the whole day\" or wedding and launch coordination." },
        { name: "Liquor Liability (Host)", why: "Serving or hosting alcohol creates dram-shop exposure GL excludes.", pivot: "Do your events serve or host alcohol?", listen: "\"There's always a bar\" or receptions and corporate parties." },
        { name: "Equipment Floater", why: "Sound, lighting, and staging gear is high-value and always on the move.", pivot: "What's your gear worth, and does it travel between venues?", listen: "\"The truck is full of gear\" or equipment left at venues overnight." },
        { name: "Umbrella", why: "A crowd injury or alcohol-related loss can far exceed standard limits.", pivot: "Do venues require higher liability limits before you can work?", listen: "\"The venue had insurance requirements\" or large-crowd events." } ] },
    { title: "Light Manufacturing & Wholesale Distribution", icon: "ti-building-factory-2", category: "Workers' Comp", tagline: "Machinery, product, and fleet exposure",
      products: [
        { name: "Product Liability", why: "As maker or distributor you sit at the center of the liability chain.", pivot: "Do you manufacture, import, or distribute physical products?", listen: "\"Our product ships nationwide\" or private-label and imported goods." },
        { name: "Commercial Auto", why: "Delivery and distribution fleets create severe auto exposure.", pivot: "Do you run delivery trucks or a distribution fleet?", listen: "\"We deliver it ourselves\" or owned trucks on the highway daily." },
        { name: "Inland Marine", why: "Goods in transit and off-site stock aren't covered by fixed-location property.", pivot: "Do you ship between facilities or use third-party fulfillment?", listen: "\"Stock moves between our warehouses\" or 3PL fulfillment." },
        { name: "Equipment Breakdown", why: "A failed press or machine halts the line — property won't cover the failure.", pivot: "How much of production depends on a few key machines?", listen: "\"If the press goes down we stop\" or aging production equipment." } ] },
  ];

  /* ── Resources ── doc / sheet / contact ── */
  const RESOURCES = [
    { type: "doc", icon: "ti-map-2", title: "SMB Coverage Map", subtitle: "Every class of business and coverage tier on two printable pages. The field reference behind this whole tool.", link: "#" },
    { type: "doc", icon: "ti-list-search", title: "Workers' Comp Class Code Lookup", subtitle: "Search NCCI class codes and base rates by state before you quote.", link: "#" },
    { type: "doc", icon: "ti-target-arrow", title: "Carrier Appetite Guide", subtitle: "Who writes what — appetite by industry, state, and account size.", link: "#" },
    { type: "doc", icon: "ti-receipt", title: "Rate Sheet — Q2 2026", subtitle: "Current base rates and package discounts across every line we write.", link: "#" },
    { type: "doc", icon: "ti-file-certificate", title: "Certificate of Insurance Template", subtitle: "Standard COI to send a client while a policy is binding.", link: "#" },

    { type: "sheet", icon: "ti-stack-2", title: "Coverage tiers, defined", body: "Must-have — bind it before they open the doors; the exposure is near-certain and often legally or contractually required. Recommended — raise it on every qualifying account; the gap is common and expensive. Consider — know it so you can name it the moment the client's cue appears." },
    { type: "sheet", icon: "ti-messages", title: "Objection-handling framework", body: "1. Name it — get the real objection on the table, not the surface line. 2. Validate — acknowledge it honestly so they stop defending it. 3. Reframe — move from price-in-isolation to total cost of risk. 4. Bridge — ask the one question that advances the conversation to the next step." },
    { type: "sheet", icon: "ti-arrows-shuffle", title: "Cross-sell cue glossary", body: "\"We drive to clients\" → Hired & Non-Owned Auto. \"We hold keys / access\" → Care, Custody & Control. \"We handle client money\" → Crime / Fidelity. \"We give advice or deliverables\" → Professional Liability (E&O). \"We store customer data\" → Cyber. \"A contract requires higher limits\" → Umbrella / Excess." },

    { type: "contact", icon: "ti-headset", title: "Underwriting desk", subtitle: "New & complex risks", body: "Appetite questions, manual rating, and large or unusual accounts.", link: "#uw-desk · ext. 210" },
    { type: "contact", icon: "ti-urgent", title: "Claims — first notice", subtitle: "FNOL intake", body: "A client needs to report a loss right now. Available 24/7.", link: "1-800-NEXT-CLM" },
    { type: "contact", icon: "ti-file-pencil", title: "Billing & endorsements", subtitle: "Policy servicing", body: "Mid-term changes, cancellations, and payment issues.", link: "#billing" },
    { type: "contact", icon: "ti-scale", title: "Compliance / licensing", subtitle: "Regulatory", body: "Surplus lines, state filings, and producer license questions.", link: "#compliance" },
  ];

  /* ── Tabs / sections (labels, header copy, optional pop-up notice) ── */
  const SECTIONS = [
    { id: "cob", label: "COB Coverage", icon: "ti-shield-half",
      eyebrow: "Class of business · coverage discovery",
      headline: "Know the coverage before they know the risk.",
      blurb: "Sixteen classes of business, every coverage that matters, and the client cue that tells you to bring it up. Open a class to study what to bind, what to recommend, and what to keep in your back pocket.",
      notice: { on: false, tone: "info", title: "", body: "" } },
    { id: "vertical", label: "Vertical Risk", icon: "ti-building-store",
      eyebrow: "SPOT THE NEED",
      headline: "Spot the gap before they describe the business.",
      blurb: "Sixteen common SMB industries, the exposures that ride along with each, and the cross-sell gaps worth probing. Flip a card to reveal the openings and what to listen for.",
      notice: { on: false, tone: "info", title: "", body: "" } },
    { id: "objection", label: "Objection Handling", icon: "ti-messages",
      eyebrow: "Objection handling",
      headline: "Turn the pushback into the next step.",
      blurb: "The objections you hear most, what's really driving each one, and the bridge question that keeps the conversation moving. Flip a card for the move.",
      notice: { on: false, tone: "info", title: "", body: "" } },
    { id: "resources", label: "Resources", icon: "ti-folder",
      eyebrow: "Field resources",
      headline: "Everything you need between calls.",
      blurb: "The guides, cheat sheets, and people that back up every conversation in this playbook.",
      notice: { on: false, tone: "info", title: "", body: "" } },
  ];

  /* ── Resource sub-sections (groups shown on the Resources tab) ── */
  const RES_SECTIONS = [
    { id: "cheats", title: "Quick Reference / Cheat Sheets", subtitle: "Applies to everyone" },
    { id: "pc",     title: "P&C Resources & Guides", subtitle: "" },
    { id: "wc",     title: "Workers' Comp Resources & Guides", subtitle: "" },
  ];
  /* Where a resource lands by default — pure structure, never edits content. */
  function defaultResSection(r) {
    if (r.type === "sheet") return "cheats";
    if (r.type === "doc") {
      const hay = ((r.title || "") + " " + (r.subtitle || "")).toLowerCase();
      return /workers|ncci|class code/.test(hay) ? "wc" : "pc";
    }
    return ""; // contacts & others: kept in data, shown only once assigned a section
  }

  const NOTICE_TONES = {
    info:    { label: "Info",    icon: "ti-info-circle",    accent: "var(--en-burgundy)", bg: "var(--en-rose-50)" },
    warning: { label: "Warning", icon: "ti-alert-triangle", accent: "var(--en-amber)",    bg: "var(--en-yellow-light)" },
    success: { label: "Success", icon: "ti-circle-check",   accent: "var(--en-leaf-d3)",  bg: "var(--en-leaf-light)" },
  };

  /* ── Global settings: tool branding + optional persistent banner ── */
  const SETTINGS = {
    toolName: "Field Playbook",
    toolTagline: "Agent sales enablement",
    banner: { on: false, tone: "info", text: "" },
    tiers: TIER_ORDER.reduce((m, k) => { m[k] = { label: TIER_META[k].label, sub: TIER_META[k].sub }; return m; }, {}),
  };
  function freshSettings() { return { ...SETTINGS, banner: { ...SETTINGS.banner }, tiers: JSON.parse(JSON.stringify(SETTINGS.tiers)) }; }

  /* Patch loaded data so it always carries a clean `sections` array,
     every COB coverage carries a `claim`, and every vertical product
     carries a `listen` field. */
  function ensureSections(data) {
    if (!data) return data;
    const fresh = SECTIONS.map((s) => ({ ...s, notice: { ...s.notice } }));
    if (!Array.isArray(data.sections) || !data.sections.length) {
      data.sections = fresh;
    } else {
      data.sections = data.sections.map((s) => ({
        ...s,
        notice: { on: false, tone: "info", title: "", body: "", ...(s.notice || {}) },
      }));
    }
    // One-time content refresh. The COB classes and the SPOT/vertical cards
    // are owned by the playbook, not the user, so refresh them from seed when
    // the content version is stale — WITHOUT touching the user's resources,
    // settings/branding, objections, or section copy, which must persist.
    var SEED_CONTENT_VER = 3;
    if (data._contentVer !== SEED_CONTENT_VER) {
      var freshSeed = buildSeed();
      data.cob = freshSeed.cob;
      data.verticals = freshSeed.verticals;
      data._contentVer = SEED_CONTENT_VER;
    }
    if (Array.isArray(data.cob)) {
      data.cob.forEach((c) => {
        if (!c.policies) return;
        TIER_ORDER.forEach((k) => {
          (c.policies[k] || []).forEach((p) => { if (typeof p.claim !== "string") p.claim = ""; });
        });
      });
    }
    if (Array.isArray(data.verticals)) {
      data.verticals.forEach((v) => {
        (v.products || []).forEach((p) => { if (typeof p.listen !== "string") p.listen = ""; });
      });
    }
    {
      const s = data.settings || {};
      const t0 = s.tiers || {};
      const tiers = {};
      TIER_ORDER.forEach((k) => {
        const o = t0[k] || {};
        tiers[k] = {
          label: typeof o.label === "string" ? o.label : TIER_META[k].label,
          sub: typeof o.sub === "string" ? o.sub : TIER_META[k].sub,
        };
      });
      data.settings = {
        toolName: typeof s.toolName === "string" ? s.toolName : SETTINGS.toolName,
        toolTagline: typeof s.toolTagline === "string" ? s.toolTagline : SETTINGS.toolTagline,
        banner: { on: false, tone: "info", text: "", ...(s.banner || {}) },
        tiers: tiers,
      };
    }
    // Resource sub-sections + per-resource section assignment (additive; never drops content)
    if (!Array.isArray(data.resSections) || !data.resSections.length) {
      data.resSections = RES_SECTIONS.map((s) => ({ ...s }));
    } else {
      data.resSections = data.resSections.map((s) => ({ subtitle: "", ...s }));
    }
    {
      const ids = data.resSections.map((s) => s.id);
      (data.resources || []).forEach((r) => {
        if (typeof r.section !== "string") { r.section = defaultResSection(r); return; }
        if (r.section && !ids.includes(r.section)) { r.section = defaultResSection(r); }
      });
    }
    return data;
  }

  function buildSeed() {
    const cob = COB.map((c) => ({
      ...c,
      policies: {
        must: c.policies.must.map((p) => ({ ...p, id: uid("cov") })),
        rec:  c.policies.rec.map((p) => ({ ...p, id: uid("cov") })),
        opt:  c.policies.opt.map((p) => ({ ...p, id: uid("cov") })),
      },
    }));
    const objections = OBJECTIONS.map((o) => ({ ...o, id: uid("obj"), deck: "objection" }));
    const verticals = VERTICALS.map((v) => ({
      ...v, id: uid("ver"), deck: "vertical",
      products: v.products.map((p) => ({ ...p, id: uid("p") })),
    }));
    const resources = RESOURCES.map((r) => ({ ...r, id: uid("res"), section: defaultResSection(r) }));
    const sections = SECTIONS.map((s) => ({ ...s, notice: { ...s.notice } }));
    const resSections = RES_SECTIONS.map((s) => ({ ...s }));
    return { cob, objections, verticals, resources, sections, resSections, settings: freshSettings() };
  }

  window.__PB_SEED = {
    buildSeed, uid, ensureSections,
    OBJECTION_CATS, VERTICAL_CATS, CAT_TINT,
    TIER_ORDER, TIER_META, SECTIONS, RES_SECTIONS, NOTICE_TONES, SETTINGS,
    STORE_KEY: "cob_playbook_combined_v1",
  };
})();
