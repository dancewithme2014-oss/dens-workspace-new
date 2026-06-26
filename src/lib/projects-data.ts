export type ProjectStatus = "Active" | "Building" | "Research" | "Testing";

export type PortfolioProject = {
  number: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  status: ProjectStatus;
  architectureId: string;
  gallery: string[];
  tags: string[];
  folder?: string;
  websiteUrl?: string;
};

export const featuredProjects: PortfolioProject[] = [
  {
    number: "01", name: "BizTok", subtitle: "Live Commerce Platform",
    description: "Live-commerce platform for streams, business discovery and purchase intent.", image: "/projects/biztok/mainscreenbt.webp", status: "Active", architectureId: "biztok",
    gallery: ["/projects/biztok/mainscreenbt.webp", "/projects/biztok/secondscreenbt.webp", "/projects/biztok/thirdscreenbt.png", "/projects/biztok/fourth.webp", "/projects/biztok/BizTok Info Restream.webp"], tags: ["AI", "Commerce", "Platform"],
  },
  {
    number: "02", name: "OSA Consulting", subtitle: "AI Consulting Platform",
    description: "AI consulting site that packages offers, qualifies leads and routes requests.", image: "/projects/osa/mainosa.webp", status: "Active", architectureId: "osa-consulting",
    gallery: ["/projects/osa/mainosa.webp", "/projects/osa/osa1.png", "/projects/osa/osa2.webp", "/projects/osa/osa3.webp", "/projects/osa/osa4.webp", "/projects/osa/osa5.webp", "/projects/osa/osablog.webp"], tags: ["AI", "Consulting", "Web"],
  },
  {
    number: "03", name: "Virtual COO", subtitle: "AI Operating System",
    description: "AI operating workspace for priorities, metrics, tasks and execution.", image: "/projects/Virtual COO/main.webp", status: "Active", architectureId: "virtual-coo",
    gallery: ["/projects/Virtual COO/main.webp", "/projects/Virtual COO/first.webp", "/projects/Virtual COO/third.webp", "/projects/Virtual COO/fourth.webp", "/projects/Virtual COO/fifth.webp"], tags: ["AI", "Operations", "SaaS"],
  },
  {
    number: "04", name: "Warehouse App", subtitle: "Inventory Intelligence",
    description: "Inventory intelligence system for stock visibility, visual control and alerts.", image: "/projects/warehouse/main.webp", status: "Active", architectureId: "warehouse-app",
    gallery: ["/projects/warehouse/main.webp", "/projects/warehouse/first.jpg", "/projects/warehouse/second.jpg", "/projects/warehouse/third.webp", "/projects/warehouse/fourth.webp", "/projects/warehouse/fifth.webp", "/projects/warehouse/sixth.webp"], tags: ["AI", "Logistics", "Vision"],
  },
  {
    number: "05", name: "N8N News Autoposting", subtitle: "Content Automation",
    description: "Editorial automation pipeline for source monitoring, drafts and publishing.", image: "/projects/n8n_news/1.webp", status: "Active", architectureId: "n8n-news",
    gallery: ["/projects/n8n_news/1.webp", "/projects/n8n_news/2.webp", "/projects/n8n_news/3.png"], tags: ["n8n", "Content", "Automation"],
  },
];

export const additionalProjects: PortfolioProject[] = [
  {
    number: "06", name: "MMZ1 Promo", subtitle: "Interactive Brand Promo",
    description: "Motion-led promotional website for brand storytelling and conversion.", image: "/projects/mmz1/main.webp", status: "Active", architectureId: "mmz1-promo",
    gallery: ["/projects/mmz1/main.webp", "/projects/mmz1/clip.mp4", "/projects/mmz1/first.webp", "/projects/mmz1/second.jpg"], tags: ["Promo", "Motion", "Web"],
  },
  {
    number: "07", name: "Golden House Dubai", subtitle: "Premium Property Experience",
    description: "Premium Dubai real estate showcase for property discovery and qualified inquiries.", image: "/projects/golden lion/main screen.webp", status: "Active", architectureId: "golden-house-dubai",
    gallery: ["/projects/golden lion/main screen.webp", "/projects/golden lion/first screen.webp", "/projects/golden lion/second screen.webp", "/projects/golden lion/third screen.webp"], tags: ["Property", "Dubai", "Platform"],
  },
  {
    number: "08", name: "Chronos", subtitle: "Luxury Watch Experience",
    description: "Luxury watch storefront for catalog browsing, product storytelling and purchase intent.", image: "/projects/CHRONOS/first.webp", status: "Testing", architectureId: "chronos",
    gallery: ["/projects/CHRONOS/first.webp", "/projects/CHRONOS/second.webp", "/projects/CHRONOS/third.webp", "/projects/CHRONOS/fourth.webp"], tags: ["Luxury", "Commerce", "Web"], folder: "CHRONOS", websiteUrl: "https://luxury-watch-s.vercel.app/",
  },
  {
    number: "09", name: "LightBI", subtitle: "Business Intelligence",
    description: "Business intelligence platform for data visualization and analytics.", image: "/projects/LightBI/1.png", status: "Active", architectureId: "lightbi",
    gallery: ["/projects/LightBI/1.png", "/projects/LightBI/2.png", "/projects/LightBI/3.png", "/projects/LightBI/4.png"], tags: ["BI", "Analytics", "Data"],
  },
];

export const allProjects = [...featuredProjects, ...additionalProjects];

export const researchAreas = [
  ["AI Agents", "Exploring", "/ai-universe/chatgpt-v13.webp"], ["Robotics", "Testing", "/projects/warehouse/main.webp"], ["Computer Vision", "Researching", "/ai-universe/qwen-v10.webp"], ["Voice AI", "Testing", "/ai-universe/perplexity-v8.png"], ["Knowledge Systems", "Exploring", "/ai-universe/ecosystem-core.webp"], ["Autonomous Businesses", "Researching", "/ai-universe/space-background.webp"],
] as const;
