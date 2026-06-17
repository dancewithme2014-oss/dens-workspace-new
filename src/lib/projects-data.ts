export type ProjectStatus = "Active" | "Building" | "Research";

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
};

export const featuredProjects: PortfolioProject[] = [
  {
    number: "01", name: "BizTok", subtitle: "Live Commerce Platform",
    description: "AI-powered live shopping and business discovery platform.", image: "/projects/biztok/mainscreenbt.png", status: "Active", architectureId: "biztok",
    gallery: ["/projects/biztok/mainscreenbt.png", "/projects/biztok/secondscreenbt.png", "/projects/biztok/thirdscreenbt.png", "/projects/biztok/fourth.png", "/projects/biztok/BizTok Info Restream.png"], tags: ["AI", "Commerce", "Platform"],
  },
  {
    number: "02", name: "OSA Consulting", subtitle: "AI Consulting Platform",
    description: "Consulting, automation and business intelligence in one digital experience.", image: "/projects/osa/mainosa.png", status: "Active", architectureId: "osa-consulting",
    gallery: ["/projects/osa/mainosa.png", "/projects/osa/osa1.png", "/projects/osa/osa2.png", "/projects/osa/osa3.png", "/projects/osa/osa4.png", "/projects/osa/osa5.png", "/projects/osa/osablog.png"], tags: ["AI", "Consulting", "Web"],
  },
  {
    number: "03", name: "Virtual COO", subtitle: "AI Operating System",
    description: "An AI operating layer for daily execution, decisions and growth.", image: "/projects/Virtual COO/main.png", status: "Active", architectureId: "virtual-coo",
    gallery: ["/projects/Virtual COO/main.png", "/projects/Virtual COO/first.png", "/projects/Virtual COO/third.png", "/projects/Virtual COO/fourth.png", "/projects/Virtual COO/fifth.png"], tags: ["AI", "Operations", "SaaS"],
  },
  {
    number: "04", name: "Warehouse App", subtitle: "Inventory Intelligence",
    description: "Computer vision and automation for warehouse operations.", image: "/projects/warehouse/main.png", status: "Active", architectureId: "warehouse-app",
    gallery: ["/projects/warehouse/main.png", "/projects/warehouse/first.jpg", "/projects/warehouse/second.jpg", "/projects/warehouse/third.png", "/projects/warehouse/fourth.png", "/projects/warehouse/fifth.png", "/projects/warehouse/sixth.png"], tags: ["AI", "Logistics", "Vision"],
  },
  {
    number: "05", name: "N8N News Autoposting", subtitle: "Content Automation",
    description: "Automated research, production and publishing workflow.", image: "/projects/n8n_news/1.png", status: "Active", architectureId: "n8n-news",
    gallery: ["/projects/n8n_news/1.png", "/projects/n8n_news/2.png", "/projects/n8n_news/3.png"], tags: ["n8n", "Content", "Automation"],
  },
];

export const additionalProjects: PortfolioProject[] = [
  {
    number: "06", name: "MMZ1 Promo", subtitle: "Interactive Brand Promo",
    description: "A cinematic digital promotion experience.", image: "/projects/mmz1/main.png", status: "Active", architectureId: "mmz1-promo",
    gallery: ["/projects/mmz1/main.png", "/projects/mmz1/clip.mp4", "/projects/mmz1/first.png", "/projects/mmz1/second.jpg"], tags: ["Promo", "Motion", "Web"],
  },
  {
    number: "07", name: "Golden Lion Dubai", subtitle: "Premium Property Experience",
    description: "A premium digital showcase built for discovery and conversion.", image: "/projects/golden lion/main screen.png", status: "Active", architectureId: "golden-lion",
    gallery: ["/projects/golden lion/main screen.png", "/projects/golden lion/first screen.png", "/projects/golden lion/third screen.png", "/projects/golden lion/fourth screen.png", "/projects/golden lion/fifth screen.png"], tags: ["Property", "Dubai", "Platform"],
  },
];

export const allProjects = [...featuredProjects, ...additionalProjects];

export const researchAreas = [
  ["AI Agents", "Exploring", "/ai-universe/chatgpt-v13.png"], ["Robotics", "Testing", "/projects/warehouse/main.png"], ["Computer Vision", "Researching", "/ai-universe/qwen-v10.png"], ["Voice AI", "Testing", "/ai-universe/perplexity-v8.png"], ["Knowledge Systems", "Exploring", "/ai-universe/ecosystem-core.png"], ["Autonomous Businesses", "Researching", "/ai-universe/space-background.png"],
] as const;
