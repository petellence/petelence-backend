import "dotenv/config";
import { connectDB } from "./config/db";
import { Admin } from "./models/Admin";
import { Product } from "./models/Product";
import { Subscriber } from "./models/Subscriber";
import { Testimonial } from "./models/Testimonial";

const products = [
  {
    id: "tonico-miracolo",
    name: "Tonico Miracolo",
    subtitle: "Joint & Mobility · Dogs & Cats",
    tagline: "Rediscover the joy of movement",
    price: 1299,
    mrp: 1599,
    size: "150ml",
    image: "/image-3.png",
    images: ["/image-3.png", "/image-4.png"],
    badge: "Best Seller",
    badgeColor: "#7B1428",
    species: ["Dogs", "Cats"],
    benefits: [
      { icon: "Bone",   title: "Joint Support",      description: "Reduces stiffness and supports cartilage regeneration with Boswellia and Turmeric." },
      { icon: "Zap",    title: "Energy Boost",       description: "Ashwagandha root energises aging pets and helps restore youthful vitality." },
      { icon: "Leaf",   title: "Anti-Inflammatory",  description: "Soxhlet-extracted botanicals deliver concentrated anti-inflammatory compounds." },
      { icon: "Heart",  title: "Heart Health",       description: "Omega-3 fatty acids support cardiovascular function alongside joint health." },
    ],
    ingredients: [
      { name: "Boswellia Serrata",  amount: "150mg", purpose: "Anti-inflammatory, joint support" },
      { name: "Turmeric (Curcumin)", amount: "100mg", purpose: "Antioxidant, reduces swelling" },
      { name: "Ashwagandha Root",   amount: "80mg",  purpose: "Adaptogen, energy & vitality" },
      { name: "Fish Oil (Omega-3)", amount: "200mg", purpose: "Heart & joint lubrication" },
    ],
    howToUse: [
      "Shake gently before use.",
      "Add directly to food — 5ml for pets under 10kg, 10ml for pets over 10kg.",
      "Give once daily, preferably with a meal.",
      "Results typically visible within 3–4 weeks of consistent use.",
    ],
    description: "A powerhouse joint formula combining Italian coastal botanicals with Ayurvedic wisdom.",
    storeLinks: [
      { platform: "Amazon",   url: "https://www.amazon.in/s?k=tonico+miracolo+petellence",   tagline: "Prime eligible · Fulfilled by Amazon" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=tonico+miracolo+petellence", tagline: "Flipkart Assured · Fast delivery" },
      { platform: "Meesho",   url: "https://www.meesho.com/search?q=tonico%20miracolo%20petellence", tagline: "Value deals · Marketplace fulfilment" },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "derma-rituale",
    name: "Derma Rituale",
    subtitle: "Skin & Coat · Dogs & Cats",
    tagline: "Coat so lustrous, it speaks before they enter the room",
    price: 1199,
    mrp: 1499,
    size: "150ml",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80",
    ],
    badge: "New Formula",
    badgeColor: "#2B4A1A",
    species: ["Dogs", "Cats"],
    benefits: [
      { icon: "Sparkles", title: "Lustrous Coat",   description: "Biotin and Omega-6 promote a glossy, thick coat from the inside out." },
      { icon: "Shield",   title: "Skin Barrier",    description: "Ceramide precursors restore the skin's natural protective barrier." },
      { icon: "Flower2",  title: "Itch Relief",     description: "Neem and Calendula soothe chronic itching and hot spots naturally." },
      { icon: "Droplets", title: "Deep Hydration",  description: "Hyaluronic acid and aloe vera keep skin supple and moisturised." },
    ],
    ingredients: [
      { name: "Biotin (Vitamin B7)", amount: "500mcg", purpose: "Coat strength and growth" },
      { name: "Evening Primrose Oil", amount: "120mg", purpose: "Omega-6 for skin elasticity" },
      { name: "Neem Extract",         amount: "75mg",  purpose: "Anti-itch, antibacterial" },
      { name: "Calendula Extract",    amount: "60mg",  purpose: "Soothing, anti-inflammatory" },
    ],
    howToUse: [
      "Mix into food daily — 5ml for small breeds, 10ml for large breeds.",
      "Best given with a fat-containing meal for optimal absorption.",
      "Allow 4–6 weeks to see full coat transformation.",
      "Can be used continuously as a maintenance supplement.",
    ],
    description: "Luxurious skin and coat nutrition inspired by Italian botanicals and ancient Ayurvedic herbs.",
    storeLinks: [
      { platform: "Amazon",   url: "https://www.amazon.in/s?k=derma+rituale+petellence",   tagline: "Prime eligible · Fulfilled by Amazon" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=derma+rituale+petellence", tagline: "Flipkart Assured · Fast delivery" },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: "immuno-forte",
    name: "Immuno Forte",
    subtitle: "Immunity · Dogs",
    tagline: "The invisible shield your dog deserves",
    price: 1399,
    mrp: 1699,
    size: "200ml",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80",
    ],
    badge: "Vet Approved",
    badgeColor: "#1A3A5C",
    species: ["Dogs"],
    benefits: [
      { icon: "Shield",       title: "Immune Shield",  description: "Beta-glucans activate macrophages for a rapid immune response." },
      { icon: "Microscope",   title: "Gut Microbiome", description: "Prebiotic fibres nourish beneficial bacteria in the digestive tract." },
      { icon: "FlaskConical", title: "Antioxidant",    description: "Vitamin C and E neutralise free radicals, slowing cellular aging." },
      { icon: "Sprout",       title: "Tulsi Complex",  description: "Sacred basil provides adaptogenic support during stress or illness." },
    ],
    ingredients: [
      { name: "Beta-Glucan (Oat)",     amount: "100mg", purpose: "Immune system activation" },
      { name: "Tulsi (Holy Basil)",    amount: "90mg",  purpose: "Adaptogen, antiviral" },
      { name: "Vitamin C (Ascorbate)", amount: "50mg",  purpose: "Antioxidant, collagen synthesis" },
      { name: "Inulin (Prebiotic)",    amount: "200mg", purpose: "Gut microbiome support" },
    ],
    howToUse: [
      "Administer 10ml daily mixed into food.",
      "Give in the morning for best absorption.",
      "Safe for long-term use — no withdrawal period needed.",
      "Increase to twice daily during illness or high-stress periods.",
    ],
    description: "A comprehensive immunity formula built for dogs who deserve to live fully protected.",
    storeLinks: [
      { platform: "Amazon",   url: "https://www.amazon.in/s?k=immuno+forte+petellence",   tagline: "Prime eligible · Fulfilled by Amazon" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=immuno+forte+petellence", tagline: "Flipkart Assured · Fast delivery" },
      { platform: "Meesho",   url: "https://www.meesho.com/search?q=immuno%20forte%20petellence", tagline: "Value deals · Marketplace fulfilment" },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "calmo-sera",
    name: "Calmo Sera",
    subtitle: "Calming · Dogs & Cats",
    tagline: "Peace, naturally — every evening",
    price: 1099,
    mrp: 1399,
    size: "100ml",
    image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&q=80",
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80",
    ],
    badge: "Calming",
    badgeColor: "#3D1A5C",
    species: ["Dogs", "Cats"],
    benefits: [
      { icon: "Moon",          title: "Deep Sleep",     description: "Valerian and Melatonin help regulate sleep cycles for restful nights." },
      { icon: "Wind",          title: "Anxiety Relief", description: "L-Theanine promotes alpha brain waves — calm focus without sedation." },
      { icon: "CloudLightning",title: "Storm & Travel", description: "Proven effective during fireworks, car rides, and separation anxiety." },
      { icon: "Leaf",          title: "Jatamansi Root", description: "Ayurvedic nervine tonic calms the nervous system naturally." },
    ],
    ingredients: [
      { name: "L-Theanine",        amount: "100mg", purpose: "Promotes calm focus, reduces anxiety" },
      { name: "Valerian Root",     amount: "80mg",  purpose: "Natural sedative, sleep regulation" },
      { name: "Jatamansi Extract", amount: "60mg",  purpose: "Ayurvedic nervine, stress relief" },
      { name: "Melatonin",         amount: "0.5mg", purpose: "Sleep-wake cycle regulation" },
    ],
    howToUse: [
      "Give 5ml (small pets) or 10ml (large pets) 30–60 minutes before a stressful event.",
      "For ongoing anxiety, administer daily with evening meal.",
      "Safe for cats and dogs from 6 months of age.",
      "Can be combined with other Pete'llence supplements.",
    ],
    description: "A gentle, non-sedating calming formula for pets who experience anxiety, stress, or sleep issues.",
    storeLinks: [
      { platform: "Amazon",   url: "https://www.amazon.in/s?k=calmo+sera+petellence",   tagline: "Prime eligible · Fulfilled by Amazon" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=calmo+sera+petellence", tagline: "Flipkart Assured · Fast delivery" },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: "digestivo-vivo",
    name: "Digestivo Vivo",
    subtitle: "Gut Health · Dogs & Cats",
    tagline: "A calmer belly for brighter days",
    price: 999,
    mrp: 1299,
    size: "120ml",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=900&q=80",
    ],
    badge: "Gut Care",
    badgeColor: "#0F766E",
    species: ["Dogs", "Cats"],
    benefits: [
      { icon: "Microscope", title: "Microbiome Support", description: "Prebiotic fibres and probiotic metabolites support a balanced digestive ecosystem." },
      { icon: "Leaf", title: "Gentle Herbs", description: "Fennel, ginger, and licorice help soothe occasional gas and digestive discomfort." },
      { icon: "Activity", title: "Better Absorption", description: "Enzyme cofactors support nutrient uptake from everyday meals." },
      { icon: "Droplets", title: "Daily Comfort", description: "Liquid format is easy to mix with wet food, kibble, or home-cooked meals." },
    ],
    ingredients: [
      { name: "Inulin Prebiotic", amount: "180mg", purpose: "Feeds beneficial gut bacteria" },
      { name: "Fennel Extract", amount: "70mg", purpose: "Helps reduce gas and bloating" },
      { name: "Ginger Root", amount: "60mg", purpose: "Digestive motility support" },
      { name: "Papaya Enzyme Blend", amount: "45mg", purpose: "Supports protein digestion" },
    ],
    howToUse: [
      "Mix 5ml into food once daily for pets under 10kg.",
      "Use 10ml once daily for pets over 10kg.",
      "Start with half serving for the first three days if your pet has a sensitive stomach.",
      "Keep refrigerated after opening.",
    ],
    description: "A digestive comfort formula built for pets with sensitive stomachs, inconsistent stools, or dietary transitions.",
    storeLinks: [
      { platform: "Amazon", url: "https://www.amazon.in/s?k=digestivo+vivo+petellence", tagline: "Prime eligible · Gut health favourite" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=digestivo+vivo+petellence", tagline: "Fast delivery · Easy returns" },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "renal-grazia",
    name: "Renal Grazia",
    subtitle: "Kidney & Hydration · Cats",
    tagline: "Daily renal grace for delicate felines",
    price: 1499,
    mrp: 1899,
    size: "100ml",
    image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=900&q=80",
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=900&q=80",
    ],
    badge: "Cat Focus",
    badgeColor: "#4C1D95",
    species: ["Cats"],
    benefits: [
      { icon: "Droplets", title: "Hydration Support", description: "Electrolyte-balanced botanicals encourage daily fluid support for cats." },
      { icon: "Shield", title: "Renal Wellness", description: "Cranberry and nettle help support urinary and kidney comfort." },
      { icon: "Heart", title: "Senior Friendly", description: "Gentle daily support designed for adult and senior cats." },
      { icon: "Sparkles", title: "Palatable Blend", description: "Mild taste mixes easily into wet food without overwhelming picky eaters." },
    ],
    ingredients: [
      { name: "Cranberry Extract", amount: "80mg", purpose: "Urinary tract support" },
      { name: "Nettle Leaf", amount: "65mg", purpose: "Renal botanical support" },
      { name: "Dandelion Root", amount: "55mg", purpose: "Fluid balance support" },
      { name: "Taurine", amount: "120mg", purpose: "Feline heart and eye support" },
    ],
    howToUse: [
      "Add 3ml to wet food once daily.",
      "For cats above 6kg, use up to 5ml daily.",
      "Always keep fresh water available.",
      "Consult a vet for diagnosed kidney disease or prescription diets.",
    ],
    description: "A feline-first hydration and renal support formula for adult and senior cats.",
    storeLinks: [
      { platform: "Amazon", url: "https://www.amazon.in/s?k=renal+grazia+petellence", tagline: "Prime eligible · Cat care formula" },
      { platform: "Meesho", url: "https://www.meesho.com/search?q=renal%20grazia%20petellence", tagline: "Value deals · Marketplace fulfilment" },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: "puppy-primo",
    name: "Puppy Primo",
    subtitle: "Growth & Immunity · Puppies",
    tagline: "A strong start for tiny paws",
    price: 899,
    mrp: 1199,
    size: "100ml",
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=900&q=80",
      "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?w=900&q=80",
    ],
    badge: "Puppy Care",
    badgeColor: "#B45309",
    species: ["Dogs"],
    benefits: [
      { icon: "Bone", title: "Healthy Growth", description: "Calcium cofactors and vitamin D support bone development during early growth." },
      { icon: "Shield", title: "Immune Start", description: "Colostrum-inspired nutrients support developing immunity." },
      { icon: "Sun", title: "Daily Energy", description: "B-vitamins help fuel playful days and learning routines." },
      { icon: "Heart", title: "Gentle Formula", description: "Designed for puppies from 8 weeks with a mild food-friendly taste." },
    ],
    ingredients: [
      { name: "Calcium Citrate", amount: "90mg", purpose: "Bone and teeth support" },
      { name: "Vitamin D3", amount: "400IU", purpose: "Calcium absorption" },
      { name: "Amla Extract", amount: "45mg", purpose: "Natural antioxidant support" },
      { name: "B-Complex Blend", amount: "25mg", purpose: "Energy metabolism" },
    ],
    howToUse: [
      "Give 2.5ml daily for puppies under 5kg.",
      "Give 5ml daily for puppies over 5kg.",
      "Mix into the first meal of the day.",
      "Use continuously through the first growth year.",
    ],
    description: "A puppy growth and immunity formula made for early development, steady energy, and daily resilience.",
    storeLinks: [
      { platform: "Amazon", url: "https://www.amazon.in/s?k=puppy+primo+petellence", tagline: "Prime eligible · Puppy wellness" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=puppy+primo+petellence", tagline: "Starter care · Fast delivery" },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: "senior-sereno",
    name: "Senior Sereno",
    subtitle: "Senior Wellness · Dogs",
    tagline: "Graceful ageing, one bowl at a time",
    price: 1599,
    mrp: 1999,
    size: "200ml",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&q=80",
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=900&q=80",
    ],
    badge: "Senior",
    badgeColor: "#7F1D1D",
    species: ["Dogs"],
    benefits: [
      { icon: "Heart", title: "Heart Support", description: "CoQ10 and omega fatty acids support cardiovascular health in older dogs." },
      { icon: "Lightbulb", title: "Cognitive Care", description: "Brahmi and phosphatidylserine support alertness and daily recognition." },
      { icon: "Activity", title: "Daily Vitality", description: "Adaptogens help maintain steady energy without overstimulation." },
      { icon: "Bone", title: "Mobility Assist", description: "Joint-friendly botanicals support everyday movement and comfort." },
    ],
    ingredients: [
      { name: "CoQ10", amount: "30mg", purpose: "Cardiovascular support" },
      { name: "Brahmi Extract", amount: "75mg", purpose: "Cognitive support" },
      { name: "Phosphatidylserine", amount: "40mg", purpose: "Senior brain health" },
      { name: "Boswellia Serrata", amount: "100mg", purpose: "Joint comfort" },
    ],
    howToUse: [
      "Give 10ml daily with the main meal.",
      "For dogs under 10kg, use 5ml daily.",
      "Use consistently for 6 weeks before judging results.",
      "Can be paired with Tonico Miracolo for senior mobility routines.",
    ],
    description: "A broad senior-care tonic for dogs who need heart, mind, energy, and mobility support in one daily ritual.",
    storeLinks: [
      { platform: "Amazon", url: "https://www.amazon.in/s?k=senior+sereno+petellence", tagline: "Prime eligible · Senior dog care" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=senior+sereno+petellence", tagline: "Trusted senior wellness" },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: "dental-luce",
    name: "Dental Luce",
    subtitle: "Dental & Breath · Dogs & Cats",
    tagline: "Fresh breath without the wrestling match",
    price: 799,
    mrp: 999,
    size: "80ml",
    image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1568572933382-74d440642117?w=900&q=80",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=900&q=80",
    ],
    badge: "Fresh Breath",
    badgeColor: "#0369A1",
    species: ["Dogs", "Cats"],
    benefits: [
      { icon: "Sparkles", title: "Fresh Breath", description: "Parsley seed and chlorophyll help neutralise everyday pet breath." },
      { icon: "Shield", title: "Oral Barrier", description: "Zinc and neem support gum comfort and oral hygiene." },
      { icon: "Droplets", title: "Water Friendly", description: "Can be mixed into food or diluted into drinking water." },
      { icon: "Leaf", title: "Botanical Clean", description: "No artificial colour, sugar, or harsh alcohol-based flavours." },
    ],
    ingredients: [
      { name: "Parsley Seed Extract", amount: "50mg", purpose: "Fresh breath support" },
      { name: "Chlorophyll", amount: "35mg", purpose: "Odour neutralisation" },
      { name: "Neem Bark", amount: "45mg", purpose: "Gum and oral hygiene support" },
      { name: "Zinc Citrate", amount: "20mg", purpose: "Plaque environment support" },
    ],
    howToUse: [
      "Add 2ml to food or water once daily.",
      "Use 4ml daily for pets above 15kg.",
      "For best results, pair with regular brushing or dental chews.",
      "Do not use as a replacement for veterinary dental cleaning.",
    ],
    description: "A low-effort daily oral-care liquid for pet parents who want fresher breath and cleaner routines.",
    storeLinks: [
      { platform: "Amazon", url: "https://www.amazon.in/s?k=dental+luce+petellence", tagline: "Prime eligible · Daily dental care" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=dental+luce+petellence", tagline: "Easy reorder · Fast delivery" },
    ],
    inStock: false,
    featured: false,
  },
  {
    id: "visione-clara",
    name: "Visione Clara",
    subtitle: "Eye Health · Dogs & Cats",
    tagline: "Clearer care for watchful eyes",
    price: 1249,
    mrp: 1549,
    size: "90ml",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=80",
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=900&q=80",
    ],
    badge: "Eye Care",
    badgeColor: "#1D4ED8",
    species: ["Dogs", "Cats"],
    benefits: [
      { icon: "Sun", title: "Antioxidant Care", description: "Lutein, zeaxanthin, and vitamin E support retinal antioxidant defence." },
      { icon: "Sparkles", title: "Tear Stain Support", description: "Amla and bilberry support healthier tear quality from within." },
      { icon: "Shield", title: "Daily Protection", description: "Designed for breeds prone to eye strain, tear marks, or senior eye changes." },
      { icon: "Leaf", title: "Gentle Botanicals", description: "Bilberry and marigold provide plant-based vision support." },
    ],
    ingredients: [
      { name: "Lutein", amount: "12mg", purpose: "Retinal pigment support" },
      { name: "Zeaxanthin", amount: "4mg", purpose: "Eye antioxidant support" },
      { name: "Bilberry Extract", amount: "55mg", purpose: "Microcirculation support" },
      { name: "Vitamin E", amount: "30IU", purpose: "Cellular antioxidant support" },
    ],
    howToUse: [
      "Give 3ml daily for cats and small dogs.",
      "Give 5ml daily for medium and large dogs.",
      "Mix with food and use consistently for 4-6 weeks.",
      "Seek veterinary care for redness, discharge, or sudden vision changes.",
    ],
    description: "A daily vision and tear-quality support formula with lutein, zeaxanthin, and botanicals.",
    storeLinks: [
      { platform: "Amazon", url: "https://www.amazon.in/s?k=visione+clara+petellence", tagline: "Prime eligible · Eye health support" },
      { platform: "Meesho", url: "https://www.meesho.com/search?q=hepato%20sereno%20petellence", tagline: "Speciality care marketplace" },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: "hepato-oro",
    name: "Hepato Oro",
    subtitle: "Liver Detox · Dogs",
    tagline: "Golden support for the hardworking liver",
    price: 1349,
    mrp: 1699,
    size: "150ml",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80",
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=900&q=80",
    ],
    badge: "Detox",
    badgeColor: "#A16207",
    species: ["Dogs"],
    benefits: [
      { icon: "Leaf", title: "Liver Botanicals", description: "Milk thistle and bhumi amla support liver function and detox pathways." },
      { icon: "Shield", title: "Cell Protection", description: "Antioxidants help protect liver cells from everyday oxidative stress." },
      { icon: "Activity", title: "Metabolic Support", description: "Supports pets after rich diets, medication routines, or seasonal sluggishness." },
      { icon: "Droplets", title: "Liquid Absorption", description: "Easy-to-dose liquid format supports consistent use." },
    ],
    ingredients: [
      { name: "Milk Thistle", amount: "120mg", purpose: "Liver cell support" },
      { name: "Bhumi Amla", amount: "90mg", purpose: "Liver detox support" },
      { name: "N-Acetyl Cysteine", amount: "80mg", purpose: "Glutathione support" },
      { name: "Turmeric Extract", amount: "55mg", purpose: "Antioxidant support" },
    ],
    howToUse: [
      "Give 5ml daily for dogs under 10kg.",
      "Give 10ml daily for dogs above 10kg.",
      "Use with meals for best tolerance.",
      "Check with your vet if your pet is on long-term medication.",
    ],
    description: "A liver-support tonic for dogs needing daily detox, antioxidant, and metabolic support.",
    storeLinks: [
      { platform: "Amazon", url: "https://www.amazon.in/s?k=hepato+oro+petellence", tagline: "Prime eligible · Liver support" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=hepato+oro+petellence", tagline: "Wellness delivery · Easy returns" },
    ],
    inStock: true,
    featured: false,
  },
  {
    id: "cardio-amore",
    name: "Cardio Amore",
    subtitle: "Heart & Stamina · Dogs & Cats",
    tagline: "Because every heartbeat is the whole point",
    price: 1699,
    mrp: 2099,
    size: "150ml",
    image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=900&q=80",
      "https://images.unsplash.com/photo-1508675801627-066ac4346a61?w=900&q=80",
    ],
    badge: "Heart Care",
    badgeColor: "#BE123C",
    species: ["Dogs", "Cats"],
    benefits: [
      { icon: "Heart", title: "Heart Function", description: "Taurine, CoQ10, and omega fatty acids support everyday cardiovascular wellness." },
      { icon: "Zap", title: "Stamina Support", description: "Carnitine supports cellular energy for active pets and senior companions." },
      { icon: "Shield", title: "Antioxidant Blend", description: "Hawthorn berry and vitamin E support vascular antioxidant defence." },
      { icon: "Activity", title: "Active Lifestyle", description: "Designed for pets who love walks, play, training, and adventure." },
    ],
    ingredients: [
      { name: "Taurine", amount: "250mg", purpose: "Heart muscle support" },
      { name: "L-Carnitine", amount: "150mg", purpose: "Cellular energy support" },
      { name: "CoQ10", amount: "35mg", purpose: "Cardiovascular antioxidant support" },
      { name: "Hawthorn Berry", amount: "80mg", purpose: "Circulatory support" },
    ],
    howToUse: [
      "Give 5ml daily for cats and small dogs.",
      "Give 10ml daily for medium and large dogs.",
      "Use with a meal that contains fat for best absorption.",
      "Consult your veterinarian for pets with diagnosed heart disease.",
    ],
    description: "A premium heart and stamina supplement for pets who deserve steady energy and daily cardiovascular support.",
    storeLinks: [
      { platform: "Amazon", url: "https://www.amazon.in/s?k=cardio+amore+petellence", tagline: "Prime eligible · Premium heart care" },
      { platform: "Flipkart", url: "https://www.flipkart.com/search?q=cardio+amore+petellence", tagline: "Fast delivery · Heart wellness" },
      { platform: "Meesho", url: "https://www.meesho.com/search?q=cardio%20amore%20petellence", tagline: "Vet-curated marketplace" },
    ],
    inStock: true,
    featured: true,
  },
];

const testimonials = [
  {
    name: "Dr. Priya Mehta",
    petName: "Senior clinic patients",
    petType: "Dogs & Cats",
    rating: 5,
    review: "The product detail and ingredient clarity make it easy to recommend Pete'llence formulas for long-term wellness routines.",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80",
    approved: true,
    featured: true,
  },
  {
    name: "Arjun Kapoor",
    petName: "Bruno",
    petType: "Golden Retriever",
    rating: 5,
    review: "Bruno is more comfortable on walks, and the marketplace links made ordering simple for our family.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
    approved: true,
    featured: true,
  },
  {
    name: "Kavya Nair",
    petName: "Mishti",
    petType: "Persian Cat",
    rating: 5,
    review: "Her coat looks healthier and the routine is easy to follow. I like seeing dosage steps clearly listed.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    approved: true,
    featured: false,
  },
  {
    name: "Rohan Shah",
    petName: "Coco",
    petType: "Beagle",
    rating: 4,
    review: "Submitted from storefront to verify moderation flow in admin.",
    avatar: "",
    approved: false,
    featured: false,
  },
];

const subscribers = [
  { email: "priya.mehta@example.com", source: "website", active: true },
  { email: "arjun.petparent@example.com", source: "launch-popup", active: true },
  { email: "kavya.catcare@example.com", source: "footer", active: true },
  { email: "inactive.parent@example.com", source: "website", active: false },
];

async function seed() {
  await connectDB();

  // Upsert products
  for (const p of products) {
    await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true });
  }
  console.log("✅ Products seeded");

  for (const t of testimonials) {
    await Testimonial.findOneAndUpdate(
      { name: t.name, petName: t.petName },
      t,
      { upsert: true, new: true }
    );
  }
  console.log("✅ Testimonials seeded");

  for (const s of subscribers) {
    await Subscriber.findOneAndUpdate(
      { email: s.email },
      s,
      { upsert: true, new: true }
    );
  }
  console.log("✅ Subscribers seeded");

  // Create admin if missing
  const email = process.env.ADMIN_EMAIL ?? "admin@petellence.com";
  const exists = await Admin.findOne({ email });
  if (!exists) {
    await Admin.create({
      email,
      password: process.env.ADMIN_PASSWORD ?? "Admin@123",
      name: "Pete'llence Admin",
    });
    console.log(`✅ Admin created — email: ${email}`);
  } else {
    console.log("ℹ️  Admin already exists, skipping");
  }

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
