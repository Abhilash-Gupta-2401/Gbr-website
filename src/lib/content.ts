import type { SceneId } from "@/components/three/scenes";

/**
 * All site copy lives here so it can be edited without touching layout code.
 * NOTE: claims below are written as sensible defaults for an integrated poultry company —
 * review them with GBR before going live.
 */

export const hero = {
  title: "From a single egg",
  titleItalic: "to every table.",
  body: "GBR Hatcheries brings breeding, hatching, feed and farming together — so quality never leaves our hands.",
};

export const stages = ["Breeder Farms", "Hatchery", "Feed Plant", "Broiler Farm", "Poultry Shops", "Cold-chain Logistics"];

export type Step = {
  id: string;
  scene: SceneId;
  tag: string;
  icon: "egg" | "thermometer" | "wheat" | "sprout" | "store" | "chick";
  title: string;
  italic: string;
  subheading?: string;
  body: string;
};

export const steps: Step[] = [
  {
    id: "breeder",
    scene: "breeder",
    tag: "Breeder Farm",
    icon: "egg",
    title: "Every Healthy Chicken",
    italic: "Starts Here",
    subheading: "A healthy beginning makes all the difference.",
    body: "Our journey begins with healthy parent chickens, raised with nutritious food, clean surroundings, and regular health checks. They produce the eggs that begin the next generation of chicks.",
  },
  {
    id: "hatchery",
    scene: "hatchery",
    tag: "Hatchery",
    icon: "thermometer",
    title: "From Eggs to Little",
    italic: "Chicks",
    subheading: "21 days of warmth, care, and new life.",
    body: "The eggs are carefully placed in special machines called incubators, where the right warmth and moisture are maintained. After about 21 days of care and monitoring, healthy baby chicks begin to hatch.",
  },
  {
    id: "feed",
    scene: "feed",
    tag: "Feed Plant",
    icon: "wheat",
    title: "Good Food for Healthy",
    italic: "Growth",
    subheading: "The right nutrition at every stage.",
    body: "Just like us, chickens need healthy food to grow strong. We use quality ingredients like maize and soybeans to prepare balanced feed that gives them the nutrition they need as they grow.",
  },
  {
    id: "farms",
    scene: "farms",
    tag: "Broiler Farm",
    icon: "chick",
    title: "From Little Chicks to",
    italic: "Healthy Chickens",
    subheading: "Growing stronger with care, every day.",
    body: "The baby chicks now move to our partner farms, where local farmers raise them with nutritious feed, clean surroundings, and regular health support. With proper care, the little chicks grow into healthy chickens.",
  },
  {
    id: "market",
    scene: "market",
    tag: "To Your Table",
    icon: "store",
    title: "From Our Farms to Your",
    italic: "Table",
    subheading: "Freshness and care, every step of the way.",
    body: "Once our chickens are ready, they make their way from the farms to local shops and markets. With careful handling and reliable transport, we help bring fresh, quality poultry closer to you.",
  },
];

export const features = [
  { icon: "shield", title: "Biosecurity at every gate", body: "Controlled access, disinfection and health monitoring on every site." },
  { icon: "thermometer", title: "Climate-controlled incubation", body: "Temperature and humidity held steady through all 21 days." },
  { icon: "wheat", title: "In-house feed formulation", body: "Stage-specific rations milled from locally sourced grain." },
  { icon: "stethoscope", title: "On-call veterinary support", body: "Our vets visit partner farms and respond when birds need care." },
  { icon: "handshake", title: "Fair farmer partnerships", body: "Chicks, feed and guidance supplied, with transparent settlement." },
  { icon: "truck", title: "Own logistics fleet", body: "Chicks, birds and eggs moved quickly and carefully by our team." },
] as const;

export const faqs = [
  {
    q: "How do I become a GBR partner farmer?",
    a: "Contact our farmer relations team. We'll visit your site, discuss shed requirements, and walk you through how chicks, feed and veterinary support are provided.",
  },
  {
    q: "Do you supply day-old chicks to independent farmers?",
    a: "Yes — talk to our sales team about availability, batch sizes and delivery schedules in your area.",
  },
  {
    q: "How do you keep flocks healthy?",
    a: "Every site follows biosecurity protocols — controlled entry, disinfection, vaccination schedules and regular veterinary inspection.",
  },
  {
    q: "Can I buy GBR feed separately?",
    a: "Our feed plant supplies partner farms first; contact us to check current availability for direct orders.",
  },
  {
    q: "Where can I buy GBR chicken and eggs?",
    a: "Through our retail outlets and partner shops. Reach out and we'll point you to the nearest one.",
  },
];

export const footer = [
  { title: "Company", links: ["About us", "Our story", "Careers", "Contact"] },
  { title: "Operations", links: ["Breeder farms", "Hatchery", "Feed plant", "Logistics"] },
  { title: "Farmers", links: ["Become a partner", "Veterinary support", "Training", "FAQs"] },
  { title: "Products", links: ["Day-old chicks", "Poultry feed", "Fresh chicken", "Eggs"] },
];
