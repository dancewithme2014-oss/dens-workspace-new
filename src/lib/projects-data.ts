export type ProjectStatus = "Active" | "Building" | "Research";

export type PortfolioProject = {
  number: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  status: ProjectStatus;
  metrics: [string, string][];
};

export const featuredProjects: PortfolioProject[] = [
  { number:"01", name:"BizTok", subtitle:"Live Commerce Platform", description:"AI-powered live shopping and engagement platform.", image:"/projects/biztok/mainscreenbt.png", status:"Active", metrics:[["25K+","Users"],["$2.1M+","GMV"]] },
  { number:"02", name:"Virtual COO", subtitle:"AI Operating System", description:"AI executive that runs daily operations and drives growth.", image:"/projects/Virtual COO/main.png", status:"Active", metrics:[["8K+","Businesses"],["1.2M+","Tasks"]] },
  { number:"03", name:"Warehouse AI", subtitle:"Inventory Intelligence", description:"Computer vision and AI for real-time inventory and space.", image:"/projects/warehouse/main.png", status:"Active", metrics:[["99.5%","Accuracy"],["40%","Faster"]] },
  { number:"04", name:"Marketing Engine", subtitle:"Content & Automation", description:"AI content factory for brands and marketing teams.", image:"/projects/n8n_news/main.jpg", status:"Building", metrics:[["10K+","Assets"],["300%","ROI"]] },
  { number:"05", name:"Den’s Workspace OS", subtitle:"Founder Operating System", description:"AI-native OS for building, launching and scaling ventures.", image:"/ai-universe/main-planet-v13.png", status:"Active", metrics:[["5K+","Users"],["30+","Integrations"]] },
];

export const compactProjects = [
  ["06","AI Agents Hub","Multi-agent marketplace","Active"],["07","Data OS","Unified data layer","Building"],["08","Insight Studio","AI analytics platform","Active"],["09","FlowBuilder","Automation builder","Building"],["10","DocuMind","AI document intelligence","Active"],
  ["11","Finance Copilot","AI financial assistant","Research"],["12","Meeting AI","Smart meeting notes","Active"],["13","VoiceOps","Voice automation","Building"],["14","Brand OS","Brand intelligence","Research"],["15","Predictive Engine","ML forecasting","Active"],
  ["16","Customer OS","Customer intelligence","Building"],["17","HR Copilot","AI HR assistant","Research"],["18","Legal AI","Contract intelligence","Building"],["19","Supply Chain AI","Supply chain optimization","Active"],["20","Research Copilot","AI research assistant","Research"],
] as const;

export const researchAreas = [
  ["AI Agents","Exploring","/ai-universe/chatgpt-v13.png"],["Robotics","Testing","/projects/warehouse/main.png"],["Computer Vision","Researching","/ai-universe/qwen-v10.png"],["Voice AI","Testing","/ai-universe/perplexity-v8.png"],["Knowledge Systems","Exploring","/ai-universe/ecosystem-core.png"],["Autonomous Businesses","Researching","/ai-universe/space-background.png"],
] as const;
