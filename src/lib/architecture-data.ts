export type ArchitectureLayerId = "clients" | "application" | "ai" | "automation" | "data" | "external";

export type ArchitectureNode = {
  id: string;
  layer: ArchitectureLayerId;
  row: 0 | 1;
  icon: "users" | "monitor" | "mobile" | "app" | "brain" | "sparkles" | "workflow" | "bot" | "database" | "files" | "cloud" | "payments" | "camera" | "chart";
  label: { ru: string; en: string };
  description: { ru: string; en: string };
  connections: string[];
};

export type ArchitectureProject = {
  id: string;
  name: string;
  subtitle: { ru: string; en: string };
  description: { ru: string; en: string };
  nodes: ArchitectureNode[];
};

export const architectureLayers: { id: ArchitectureLayerId; label: { ru: string; en: string } }[] = [
  { id: "clients", label: { ru: "Клиенты", en: "Clients" } },
  { id: "application", label: { ru: "Приложения", en: "Application Layer" } },
  { id: "ai", label: { ru: "ИИ-слой", en: "AI Layer" } },
  { id: "automation", label: { ru: "Автоматизация", en: "Automation Layer" } },
  { id: "data", label: { ru: "Данные", en: "Data Layer" } },
  { id: "external", label: { ru: "Внешние сервисы", en: "External Services" } },
];

const coreArchitectureProjects: ArchitectureProject[] = [
  {
    id: "biztok",
    name: "BizTok",
    subtitle: { ru: "Платформа live-коммерции", en: "Live Commerce Platform" },
    description: {
      ru: "Прямые эфиры, поиск и покупки объединены в одну событийную архитектуру.",
      en: "Live commerce, discovery and purchasing unified in one event-driven architecture.",
    },
    nodes: [
      { id: "bt-viewers", layer: "clients", row: 0, icon: "users", label: { ru: "Зрители", en: "Viewers" }, description: { ru: "Покупатели и зрители прямых эфиров.", en: "Customers and live-stream viewers." }, connections: ["bt-web", "bt-mobile"] },
      { id: "bt-creators", layer: "clients", row: 1, icon: "camera", label: { ru: "Авторы", en: "Creators" }, description: { ru: "Бизнесы и создатели live-контента.", en: "Businesses and live-content creators." }, connections: ["bt-studio"] },
      { id: "bt-web", layer: "application", row: 0, icon: "monitor", label: { ru: "Веб-платформа", en: "Web Platform" }, description: { ru: "Каталог, трансляции и страницы бизнеса.", en: "Discovery, streams and business profiles." }, connections: ["bt-recs", "bt-events"] },
      { id: "bt-mobile", layer: "application", row: 1, icon: "mobile", label: { ru: "Мобильное приложение", en: "Mobile App" }, description: { ru: "Поиск, запись и покупки с телефона.", en: "Mobile discovery, booking and purchasing." }, connections: ["bt-recs", "bt-events"] },
      { id: "bt-studio", layer: "application", row: 1, icon: "app", label: { ru: "Студия автора", en: "Creator Studio" }, description: { ru: "Управление эфиром и контентом.", en: "Live-stream and content operations." }, connections: ["bt-moderation", "bt-events"] },
      { id: "bt-recs", layer: "ai", row: 0, icon: "brain", label: { ru: "Рекомендации", en: "Recommendations" }, description: { ru: "Персональная выдача бизнесов и эфиров.", en: "Personalized business and stream discovery." }, connections: ["bt-workflows", "bt-postgres"] },
      { id: "bt-moderation", layer: "ai", row: 1, icon: "sparkles", label: { ru: "ИИ-модерация", en: "AI Moderation" }, description: { ru: "Проверка эфиров, чатов и контента.", en: "Stream, chat and content moderation." }, connections: ["bt-workflows"] },
      { id: "bt-events", layer: "automation", row: 0, icon: "workflow", label: { ru: "Событийная шина", en: "Event Bus" }, description: { ru: "Синхронизирует действия в реальном времени.", en: "Synchronizes real-time platform events." }, connections: ["bt-postgres", "bt-analytics"] },
      { id: "bt-workflows", layer: "automation", row: 1, icon: "bot", label: { ru: "n8n-процессы", en: "n8n Workflows" }, description: { ru: "Автоматизация уведомлений и операций.", en: "Notifications and operational automations." }, connections: ["bt-postgres", "bt-supabase"] },
      { id: "bt-postgres", layer: "data", row: 0, icon: "database", label: { ru: "PostgreSQL", en: "PostgreSQL" }, description: { ru: "Основные данные продукта и транзакций.", en: "Core product and transaction data." }, connections: ["bt-supabase", "bt-payments"] },
      { id: "bt-analytics", layer: "data", row: 1, icon: "chart", label: { ru: "Аналитика", en: "Analytics" }, description: { ru: "Воронки, эфиры и конверсия.", en: "Funnels, streams and conversion data." }, connections: ["bt-cloud"] },
      { id: "bt-supabase", layer: "external", row: 0, icon: "cloud", label: { ru: "Supabase", en: "Supabase" }, description: { ru: "Авторизация, хранение и инфраструктура реального времени.", en: "Auth, storage and realtime infrastructure." }, connections: [] },
      { id: "bt-payments", layer: "external", row: 1, icon: "payments", label: { ru: "Платежи", en: "Payments" }, description: { ru: "Бронирования и прямые покупки.", en: "Bookings and direct purchases." }, connections: [] },
      { id: "bt-cloud", layer: "external", row: 1, icon: "cloud", label: { ru: "Cloudflare", en: "Cloudflare" }, description: { ru: "Доставка медиа и защита трафика.", en: "Media delivery and traffic protection." }, connections: [] },
    ],
  },
  {
    id: "virtual-coo",
    name: "Virtual COO",
    subtitle: { ru: "Операционная система ИИ", en: "AI Operating System" },
    description: {
      ru: "Операционная система связывает команды, ИИ-агентов, процессы и бизнес-данные.",
      en: "An operating system connecting teams, AI agents, workflows and business data.",
    },
    nodes: [
      { id: "coo-founders", layer: "clients", row: 0, icon: "users", label: { ru: "Основатели", en: "Founders" }, description: { ru: "Руководители и владельцы компаний.", en: "Company founders and operators." }, connections: ["coo-dashboard"] },
      { id: "coo-team", layer: "clients", row: 1, icon: "users", label: { ru: "Команды", en: "Teams" }, description: { ru: "Операционные и функциональные команды.", en: "Operational and functional teams." }, connections: ["coo-workspace"] },
      { id: "coo-dashboard", layer: "application", row: 0, icon: "monitor", label: { ru: "Панель руководителя", en: "Executive Dashboard" }, description: { ru: "Приоритеты, риски и показатели бизнеса.", en: "Business priorities, risks and performance." }, connections: ["coo-agent", "coo-insights"] },
      { id: "coo-workspace", layer: "application", row: 1, icon: "app", label: { ru: "Операционное пространство", en: "Ops Workspace" }, description: { ru: "Единое пространство ежедневных операций.", en: "Unified workspace for daily operations." }, connections: ["coo-agent", "coo-router"] },
      { id: "coo-agent", layer: "ai", row: 0, icon: "brain", label: { ru: "ИИ-операционный директор", en: "COO Agent" }, description: { ru: "Планирует, анализирует и предлагает действия.", en: "Plans, analyzes and recommends actions." }, connections: ["coo-router", "coo-plans"] },
      { id: "coo-insights", layer: "ai", row: 1, icon: "sparkles", label: { ru: "Аналитический модуль", en: "Insight Engine" }, description: { ru: "Ищет отклонения и точки роста.", en: "Finds anomalies and growth opportunities." }, connections: ["coo-plans", "coo-warehouse"] },
      { id: "coo-router", layer: "automation", row: 0, icon: "workflow", label: { ru: "Маршрутизатор процессов", en: "Workflow Router" }, description: { ru: "Направляет задачи агентам и командам.", en: "Routes work to agents and teams." }, connections: ["coo-tasks", "coo-warehouse"] },
      { id: "coo-plans", layer: "automation", row: 1, icon: "bot", label: { ru: "Планировщик", en: "Planning Engine" }, description: { ru: "Создает планы и контролирует выполнение.", en: "Builds plans and monitors execution." }, connections: ["coo-tasks", "coo-warehouse"] },
      { id: "coo-tasks", layer: "data", row: 0, icon: "database", label: { ru: "Операционные данные", en: "Operational Data" }, description: { ru: "Задачи, команды, встречи и решения.", en: "Tasks, teams, meetings and decisions." }, connections: ["coo-crm", "coo-calendar"] },
      { id: "coo-warehouse", layer: "data", row: 1, icon: "chart", label: { ru: "Корпоративное хранилище", en: "Business Warehouse" }, description: { ru: "Финансы, продажи и общая аналитика.", en: "Finance, sales and unified analytics." }, connections: ["coo-crm", "coo-finance"] },
      { id: "coo-crm", layer: "external", row: 0, icon: "cloud", label: { ru: "CRM", en: "CRM" }, description: { ru: "Клиенты, сделки и продажи.", en: "Customers, deals and sales." }, connections: [] },
      { id: "coo-calendar", layer: "external", row: 1, icon: "app", label: { ru: "Календарь", en: "Calendar" }, description: { ru: "Встречи, сроки и доступность.", en: "Meetings, deadlines and availability." }, connections: [] },
      { id: "coo-finance", layer: "external", row: 1, icon: "payments", label: { ru: "Финансы", en: "Finance" }, description: { ru: "Денежные потоки и отчетность.", en: "Cash flow and reporting systems." }, connections: [] },
    ],
  },
  {
    id: "warehouse-app",
    name: "Warehouse App",
    subtitle: { ru: "Интеллектуальное управление запасами", en: "Inventory Intelligence" },
    description: {
      ru: "Компьютерное зрение превращает видеопотоки склада в точные события и прогнозы.",
      en: "Computer vision turns warehouse video streams into accurate events and forecasts.",
    },
    nodes: [
      { id: "wh-operators", layer: "clients", row: 0, icon: "users", label: { ru: "Операторы", en: "Operators" }, description: { ru: "Сотрудники склада и диспетчеры.", en: "Warehouse teams and dispatchers." }, connections: ["wh-console", "wh-mobile"] },
      { id: "wh-managers", layer: "clients", row: 1, icon: "users", label: { ru: "Менеджеры", en: "Managers" }, description: { ru: "Управление запасами и эффективностью.", en: "Inventory and performance management." }, connections: ["wh-dashboard"] },
      { id: "wh-console", layer: "application", row: 0, icon: "monitor", label: { ru: "Центр управления", en: "Control Center" }, description: { ru: "Мониторинг склада в реальном времени.", en: "Real-time warehouse monitoring." }, connections: ["wh-vision", "wh-events"] },
      { id: "wh-mobile", layer: "application", row: 1, icon: "mobile", label: { ru: "Приложение сканера", en: "Scanner App" }, description: { ru: "Приемка, проверка и перемещение товаров.", en: "Receiving, checking and moving stock." }, connections: ["wh-vision", "wh-events"] },
      { id: "wh-dashboard", layer: "application", row: 1, icon: "chart", label: { ru: "Панель запасов", en: "Inventory Dashboard" }, description: { ru: "Запасы, риски и прогнозы.", en: "Stock, risks and forecasts." }, connections: ["wh-forecast"] },
      { id: "wh-vision", layer: "ai", row: 0, icon: "camera", label: { ru: "Модели компьютерного зрения", en: "Vision Models" }, description: { ru: "Распознавание объектов и зон хранения.", en: "Object and storage-zone recognition." }, connections: ["wh-events", "wh-alerts"] },
      { id: "wh-forecast", layer: "ai", row: 1, icon: "brain", label: { ru: "Прогноз спроса", en: "Demand Forecast" }, description: { ru: "Прогноз дефицита и движения запасов.", en: "Predicts shortages and inventory movement." }, connections: ["wh-alerts", "wh-timeseries"] },
      { id: "wh-events", layer: "automation", row: 0, icon: "workflow", label: { ru: "Поток событий", en: "Event Pipeline" }, description: { ru: "Обрабатывает события камер и сканеров.", en: "Processes camera and scanner events." }, connections: ["wh-inventory", "wh-timeseries"] },
      { id: "wh-alerts", layer: "automation", row: 1, icon: "bot", label: { ru: "Модуль оповещений", en: "Alert Engine" }, description: { ru: "Создает задачи при рисках и отклонениях.", en: "Creates tasks for risks and anomalies." }, connections: ["wh-timeseries", "wh-messaging"] },
      { id: "wh-inventory", layer: "data", row: 0, icon: "database", label: { ru: "База запасов", en: "Inventory DB" }, description: { ru: "Текущее состояние товаров и ячеек.", en: "Current stock and location state." }, connections: ["wh-erp", "wh-storage"] },
      { id: "wh-timeseries", layer: "data", row: 1, icon: "chart", label: { ru: "Хранилище телеметрии", en: "Telemetry Store" }, description: { ru: "История событий и показаний оборудования.", en: "Event and equipment telemetry history." }, connections: ["wh-storage"] },
      { id: "wh-erp", layer: "external", row: 0, icon: "cloud", label: { ru: "ERP / WMS", en: "ERP / WMS" }, description: { ru: "Корпоративный учет и планирование.", en: "Enterprise inventory and planning." }, connections: [] },
      { id: "wh-storage", layer: "external", row: 1, icon: "files", label: { ru: "Объектное хранилище", en: "Object Storage" }, description: { ru: "Снимки, видео и наборы данных.", en: "Snapshots, video and datasets." }, connections: [] },
      { id: "wh-messaging", layer: "external", row: 1, icon: "app", label: { ru: "Уведомления", en: "Messaging" }, description: { ru: "Оповещения команд и интеграции.", en: "Team alerts and integrations." }, connections: [] },
    ],
  },
];

function createArchitecture(id: string, name: string, subtitle: { ru: string; en: string }, focus: { ru: string; en: string }): ArchitectureProject {
  const prefix = id.replaceAll("-", "");
  return {
    id,
    name,
    subtitle,
    description: focus,
    nodes: [
      { id: `${prefix}-users`, layer: "clients", row: 0, icon: "users", label: { ru: "Пользователи", en: "Users" }, description: { ru: "Люди, которые работают с продуктом.", en: "People working with the product." }, connections: [`${prefix}-web`] },
      { id: `${prefix}-team`, layer: "clients", row: 1, icon: "users", label: { ru: "Команда", en: "Team" }, description: { ru: "Операторы и владельцы процессов.", en: "Operators and process owners." }, connections: [`${prefix}-console`] },
      { id: `${prefix}-web`, layer: "application", row: 0, icon: "monitor", label: { ru: "Веб-приложение", en: "Web App" }, description: { ru: "Основной продуктовый интерфейс.", en: "Primary product interface." }, connections: [`${prefix}-ai`, `${prefix}-flow`] },
      { id: `${prefix}-console`, layer: "application", row: 1, icon: "app", label: { ru: "Панель управления", en: "Operations Console" }, description: { ru: "Управление контентом и операциями.", en: "Content and operations control." }, connections: [`${prefix}-insights`, `${prefix}-flow`] },
      { id: `${prefix}-ai`, layer: "ai", row: 0, icon: "brain", label: { ru: "ИИ-модель", en: "AI Model" }, description: { ru: "Интеллектуальная обработка запросов.", en: "Intelligent request processing." }, connections: [`${prefix}-flow`, `${prefix}-db`] },
      { id: `${prefix}-insights`, layer: "ai", row: 1, icon: "sparkles", label: { ru: "Аналитический модуль", en: "Insight Engine" }, description: { ru: "Анализирует данные и предлагает действия.", en: "Analyzes data and recommends actions." }, connections: [`${prefix}-automation`, `${prefix}-analytics`] },
      { id: `${prefix}-flow`, layer: "automation", row: 0, icon: "workflow", label: { ru: "Модуль процессов", en: "Workflow Engine" }, description: { ru: "Связывает события и процессы.", en: "Connects events and processes." }, connections: [`${prefix}-db`, `${prefix}-cloud`] },
      { id: `${prefix}-automation`, layer: "automation", row: 1, icon: "bot", label: { ru: "Автоматизации", en: "Automations" }, description: { ru: "Выполняет повторяемые операции.", en: "Executes repeatable operations." }, connections: [`${prefix}-analytics`, `${prefix}-integrations`] },
      { id: `${prefix}-db`, layer: "data", row: 0, icon: "database", label: { ru: "База продукта", en: "Product DB" }, description: { ru: "Основные данные продукта.", en: "Core product data." }, connections: [`${prefix}-cloud`] },
      { id: `${prefix}-analytics`, layer: "data", row: 1, icon: "chart", label: { ru: "Аналитика", en: "Analytics" }, description: { ru: "События, отчеты и показатели.", en: "Events, reports and performance." }, connections: [`${prefix}-integrations`] },
      { id: `${prefix}-cloud`, layer: "external", row: 0, icon: "cloud", label: { ru: "Облачные сервисы", en: "Cloud Services" }, description: { ru: "Хостинг, хранение и доставка.", en: "Hosting, storage and delivery." }, connections: [] },
      { id: `${prefix}-integrations`, layer: "external", row: 1, icon: "files", label: { ru: "Интеграции", en: "Integrations" }, description: { ru: "Внешние каналы и бизнес-системы.", en: "External channels and business systems." }, connections: [] },
    ],
  };
}

export const architectureProjects: ArchitectureProject[] = [
  ...coreArchitectureProjects,
  createArchitecture("osa-consulting", "OSA Consulting", { ru: "Платформа ИИ-консалтинга", en: "AI Consulting Platform" }, { ru: "Консалтинг, аналитика и автоматизация объединены в одной системе.", en: "Consulting, analytics and automation unified in one system." }),
  createArchitecture("n8n-news", "N8N News Autoposting", { ru: "Автоматизация контента", en: "Content Automation" }, { ru: "Система исследует источники, готовит материалы и управляет публикацией.", en: "The system researches sources, prepares content and manages publishing." }),
  createArchitecture("mmz1-promo", "MMZ1 Promo", { ru: "Интерактивное бренд-промо", en: "Interactive Brand Promo" }, { ru: "Промо-опыт связывает медиа, интерактив и аналитику вовлечения.", en: "The promo experience connects media, interaction and engagement analytics." }),
  createArchitecture("golden-lion", "Golden Lion Dubai", { ru: "Премиальная платформа недвижимости", en: "Premium Property Experience" }, { ru: "Платформа объединяет каталог, контент, заявки и коммуникацию.", en: "The platform connects catalog, content, inquiries and communication." }),
];
