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

const additionalArchitectureProjects: ArchitectureProject[] = [
  {
    id: "osa-consulting",
    name: "OSA Consulting",
    subtitle: { ru: "Платформа ИИ-консалтинга", en: "AI Consulting Platform" },
    description: {
      ru: "Сайт объясняет услуги, квалифицирует входящие заявки и превращает интерес в понятный консультационный процесс.",
      en: "The site explains services, qualifies inbound leads and turns interest into a clear consulting workflow.",
    },
    nodes: [
      { id: "osa-founders", layer: "clients", row: 0, icon: "users", label: { ru: "Основатели", en: "Founders" }, description: { ru: "Предприниматели, которые ищут ИИ-решения для бизнеса.", en: "Business owners looking for practical AI systems." }, connections: ["osa-site", "osa-intake"] },
      { id: "osa-team", layer: "clients", row: 1, icon: "users", label: { ru: "Команда OSA", en: "OSA Team" }, description: { ru: "Консультанты, которые обрабатывают заявки и ведут проекты.", en: "Consultants processing inquiries and running projects." }, connections: ["osa-console"] },
      { id: "osa-site", layer: "application", row: 0, icon: "monitor", label: { ru: "Сайт услуг", en: "Service Site" }, description: { ru: "Упаковывает предложения, кейсы и путь к заявке.", en: "Packages offers, cases and the path to inquiry." }, connections: ["osa-diagnostic", "osa-router"] },
      { id: "osa-intake", layer: "application", row: 1, icon: "app", label: { ru: "Форма брифа", en: "Intake Form" }, description: { ru: "Собирает контекст задачи до первого созвона.", en: "Captures context before the first call." }, connections: ["osa-scoring", "osa-router"] },
      { id: "osa-diagnostic", layer: "ai", row: 0, icon: "brain", label: { ru: "ИИ-диагностика", en: "AI Diagnostic" }, description: { ru: "Определяет тип задачи и возможный формат решения.", en: "Identifies the problem type and potential solution format." }, connections: ["osa-router", "osa-crm"] },
      { id: "osa-scoring", layer: "ai", row: 1, icon: "sparkles", label: { ru: "Оценка заявки", en: "Lead Scoring" }, description: { ru: "Помогает отделить сильные запросы от шумовых обращений.", en: "Separates high-intent opportunities from noise." }, connections: ["osa-followup", "osa-analytics"] },
      { id: "osa-router", layer: "automation", row: 0, icon: "workflow", label: { ru: "Маршрутизация", en: "Lead Router" }, description: { ru: "Направляет заявку в нужный сценарий обработки.", en: "Routes each inquiry into the right handling path." }, connections: ["osa-crm", "osa-calendar"] },
      { id: "osa-followup", layer: "automation", row: 1, icon: "bot", label: { ru: "Follow-up", en: "Follow-up" }, description: { ru: "Запускает письма, напоминания и подготовку к созвону.", en: "Triggers emails, reminders and call preparation." }, connections: ["osa-analytics", "osa-email"] },
      { id: "osa-crm", layer: "data", row: 0, icon: "database", label: { ru: "CRM-заявки", en: "CRM Leads" }, description: { ru: "Хранит контакты, задачи и статус возможности.", en: "Stores contacts, opportunities and lead status." }, connections: ["osa-calendar", "osa-email"] },
      { id: "osa-analytics", layer: "data", row: 1, icon: "chart", label: { ru: "Аналитика спроса", en: "Demand Analytics" }, description: { ru: "Показывает, какие услуги и сообщения конвертируют лучше.", en: "Shows which offers and messages convert best." }, connections: ["osa-email"] },
      { id: "osa-calendar", layer: "external", row: 0, icon: "app", label: { ru: "Календарь", en: "Calendar" }, description: { ru: "Помогает быстро назначить консультацию.", en: "Helps schedule the consulting call quickly." }, connections: [] },
      { id: "osa-email", layer: "external", row: 1, icon: "cloud", label: { ru: "Email / CRM", en: "Email / CRM" }, description: { ru: "Внешние каналы коммуникации и статусов.", en: "External communication and status channels." }, connections: [] },
    ],
  },
  {
    id: "n8n-news",
    name: "N8N News Autoposting",
    subtitle: { ru: "Автоматизация контента", en: "Content Automation" },
    description: {
      ru: "Редакционный конвейер собирает новости, готовит черновики, хранит материалы и управляет публикацией.",
      en: "An editorial pipeline collects news, prepares drafts, stores materials and manages publishing.",
    },
    nodes: [
      { id: "news-editor", layer: "clients", row: 0, icon: "users", label: { ru: "Редактор", en: "Editor" }, description: { ru: "Проверяет черновики и принимает решение о публикации.", en: "Reviews drafts and decides what gets published." }, connections: ["news-admin"] },
      { id: "news-readers", layer: "clients", row: 1, icon: "users", label: { ru: "Аудитория", en: "Readers" }, description: { ru: "Читатели сайта и подписчики Telegram.", en: "Website readers and Telegram subscribers." }, connections: ["news-feed"] },
      { id: "news-admin", layer: "application", row: 0, icon: "app", label: { ru: "Редакционная панель", en: "Editorial Panel" }, description: { ru: "Позволяет редактировать, утверждать и публиковать новости.", en: "Allows editing, approval and publishing." }, connections: ["news-summarizer", "news-publish"] },
      { id: "news-feed", layer: "application", row: 1, icon: "monitor", label: { ru: "Лента сайта", en: "Website Feed" }, description: { ru: "Показывает опубликованные материалы на сайте.", en: "Displays published stories on the website." }, connections: ["news-classifier", "news-articles"] },
      { id: "news-summarizer", layer: "ai", row: 0, icon: "brain", label: { ru: "Суммаризация", en: "Summarization" }, description: { ru: "Готовит краткий материал из исходной новости.", en: "Turns source content into an editorial draft." }, connections: ["news-orchestrator", "news-articles"] },
      { id: "news-classifier", layer: "ai", row: 1, icon: "sparkles", label: { ru: "Категоризация", en: "Classification" }, description: { ru: "Определяет категорию, теги и ценность сигнала.", en: "Assigns category, tags and signal quality." }, connections: ["news-orchestrator", "news-articles"] },
      { id: "news-orchestrator", layer: "automation", row: 0, icon: "workflow", label: { ru: "n8n-оркестратор", en: "n8n Orchestrator" }, description: { ru: "Связывает источники, ИИ, Supabase и публикацию.", en: "Connects sources, AI, Supabase and publishing." }, connections: ["news-articles", "news-sources"] },
      { id: "news-publish", layer: "automation", row: 1, icon: "bot", label: { ru: "Публикация", en: "Publishing Flow" }, description: { ru: "Отправляет материал на сайт и в Telegram-сценарии.", en: "Publishes to the site and Telegram workflows." }, connections: ["news-media", "news-telegram"] },
      { id: "news-articles", layer: "data", row: 0, icon: "database", label: { ru: "Supabase Articles", en: "Supabase Articles" }, description: { ru: "Хранит новости, статусы, версии и метаданные.", en: "Stores articles, statuses, versions and metadata." }, connections: ["news-sources"] },
      { id: "news-media", layer: "data", row: 1, icon: "files", label: { ru: "Vercel Blob", en: "Vercel Blob" }, description: { ru: "Хранит превью и изображения материалов.", en: "Stores previews and article images." }, connections: ["news-telegram"] },
      { id: "news-sources", layer: "external", row: 0, icon: "cloud", label: { ru: "Источники", en: "Sources" }, description: { ru: "Hacker News, RSS, API и другие входящие каналы.", en: "Hacker News, RSS, APIs and other input channels." }, connections: [] },
      { id: "news-telegram", layer: "external", row: 1, icon: "app", label: { ru: "Telegram", en: "Telegram" }, description: { ru: "Канал публикации и обратной связи.", en: "Publishing and feedback channel." }, connections: [] },
    ],
  },
  {
    id: "mmz1-promo",
    name: "MMZ1 Promo",
    subtitle: { ru: "Интерактивное бренд-промо", en: "Interactive Brand Promo" },
    description: {
      ru: "Промо-сайт строит эмоциональную презентацию бренда через видео, движение и понятный CTA.",
      en: "A promo site creates emotional brand presentation through video, motion and a clear CTA.",
    },
    nodes: [
      { id: "mmz-visitors", layer: "clients", row: 0, icon: "users", label: { ru: "Посетители", en: "Visitors" }, description: { ru: "Люди, которые знакомятся с брендом через промо-опыт.", en: "People discovering the brand through the promo experience." }, connections: ["mmz-landing"] },
      { id: "mmz-brand", layer: "clients", row: 1, icon: "users", label: { ru: "Бренд-команда", en: "Brand Team" }, description: { ru: "Команда, которая управляет сообщением и визуальной подачей.", en: "The team managing message and visual direction." }, connections: ["mmz-content"] },
      { id: "mmz-landing", layer: "application", row: 0, icon: "monitor", label: { ru: "Промо-лендинг", en: "Promo Landing" }, description: { ru: "Главный сценарий знакомства с продуктом или кампанией.", en: "The main discovery path for the product or campaign." }, connections: ["mmz-story", "mmz-capture"] },
      { id: "mmz-content", layer: "application", row: 1, icon: "camera", label: { ru: "Медиа-сцена", en: "Media Stage" }, description: { ru: "Видео, изображения и визуальные акценты промо.", en: "Video, imagery and visual brand moments." }, connections: ["mmz-signals", "mmz-cdn"] },
      { id: "mmz-story", layer: "ai", row: 0, icon: "sparkles", label: { ru: "Сторителлинг", en: "Storytelling Layer" }, description: { ru: "Собирает подачу в последовательный эмоциональный маршрут.", en: "Shapes the experience into an emotional sequence." }, connections: ["mmz-capture", "mmz-assets"] },
      { id: "mmz-signals", layer: "ai", row: 1, icon: "chart", label: { ru: "Сигналы интереса", en: "Interest Signals" }, description: { ru: "Помогает понимать, где пользователь вовлекается или уходит.", en: "Shows where users engage or drop off." }, connections: ["mmz-analytics"] },
      { id: "mmz-capture", layer: "automation", row: 0, icon: "workflow", label: { ru: "CTA-сценарий", en: "CTA Flow" }, description: { ru: "Переводит внимание в контакт или следующее действие.", en: "Turns attention into contact or the next action." }, connections: ["mmz-leads", "mmz-contact"] },
      { id: "mmz-deploy", layer: "automation", row: 1, icon: "bot", label: { ru: "Деплой", en: "Deploy Flow" }, description: { ru: "Быстро доставляет обновления промо-страницы.", en: "Ships promo updates quickly." }, connections: ["mmz-assets", "mmz-cdn"] },
      { id: "mmz-leads", layer: "data", row: 0, icon: "database", label: { ru: "Заявки", en: "Leads" }, description: { ru: "Фиксирует обращения и действия посетителей.", en: "Captures inquiries and visitor actions." }, connections: ["mmz-contact"] },
      { id: "mmz-assets", layer: "data", row: 1, icon: "files", label: { ru: "Медиа-ассеты", en: "Media Assets" }, description: { ru: "Хранит видео, изображения и элементы бренда.", en: "Stores video, images and brand elements." }, connections: ["mmz-cdn"] },
      { id: "mmz-contact", layer: "external", row: 0, icon: "app", label: { ru: "Контакты", en: "Contact Channels" }, description: { ru: "Email, мессенджеры и внешние точки связи.", en: "Email, messengers and external contact points." }, connections: [] },
      { id: "mmz-cdn", layer: "external", row: 1, icon: "cloud", label: { ru: "Vercel / CDN", en: "Vercel / CDN" }, description: { ru: "Доставка сайта и тяжелых медиа.", en: "Delivery for the site and heavy media." }, connections: [] },
    ],
  },
  {
    id: "golden-house-dubai",
    name: "Golden House Dubai",
    subtitle: { ru: "Премиальная платформа недвижимости", en: "Premium Property Experience" },
    description: {
      ru: "Витрина недвижимости соединяет премиальную подачу, каталог объектов и обработку входящих заявок.",
      en: "A real-estate showcase connecting premium presentation, property catalog and inquiry handling.",
    },
    nodes: [
      { id: "gh-buyers", layer: "clients", row: 0, icon: "users", label: { ru: "Покупатели", en: "Buyers" }, description: { ru: "Клиенты, которые выбирают недвижимость в Дубае.", en: "Clients exploring Dubai real estate." }, connections: ["gh-showcase", "gh-leadform"] },
      { id: "gh-agents", layer: "clients", row: 1, icon: "users", label: { ru: "Агенты", en: "Agents" }, description: { ru: "Команда, которая сопровождает заявки и объекты.", en: "The team handling inquiries and properties." }, connections: ["gh-console"] },
      { id: "gh-showcase", layer: "application", row: 0, icon: "monitor", label: { ru: "Витрина объектов", en: "Property Showcase" }, description: { ru: "Показывает объекты, районы и преимущества предложения.", en: "Presents properties, locations and offer value." }, connections: ["gh-matching", "gh-routing"] },
      { id: "gh-leadform", layer: "application", row: 1, icon: "app", label: { ru: "Форма заявки", en: "Inquiry Form" }, description: { ru: "Собирает бюджет, интерес и контакт покупателя.", en: "Captures budget, interest and buyer contact." }, connections: ["gh-scoring", "gh-routing"] },
      { id: "gh-matching", layer: "ai", row: 0, icon: "brain", label: { ru: "Подбор объектов", en: "Property Matching" }, description: { ru: "Соотносит интерес клиента с типами объектов.", en: "Matches buyer intent with property types." }, connections: ["gh-catalog", "gh-followup"] },
      { id: "gh-scoring", layer: "ai", row: 1, icon: "sparkles", label: { ru: "Оценка лида", en: "Lead Scoring" }, description: { ru: "Помогает приоритизировать сильные входящие запросы.", en: "Helps prioritize high-intent inquiries." }, connections: ["gh-leads", "gh-followup"] },
      { id: "gh-routing", layer: "automation", row: 0, icon: "workflow", label: { ru: "Маршрутизация заявок", en: "Inquiry Routing" }, description: { ru: "Передает запрос агенту и фиксирует следующий шаг.", en: "Routes the inquiry to an agent and records the next step." }, connections: ["gh-leads", "gh-crm"] },
      { id: "gh-followup", layer: "automation", row: 1, icon: "bot", label: { ru: "Follow-up", en: "Follow-up" }, description: { ru: "Запускает коммуникацию после интереса к объекту.", en: "Starts communication after property interest." }, connections: ["gh-leads", "gh-messaging"] },
      { id: "gh-catalog", layer: "data", row: 0, icon: "database", label: { ru: "Каталог объектов", en: "Property Catalog" }, description: { ru: "Хранит объекты, медиа, цены и характеристики.", en: "Stores properties, media, prices and attributes." }, connections: ["gh-crm"] },
      { id: "gh-leads", layer: "data", row: 1, icon: "chart", label: { ru: "Воронка заявок", en: "Lead Funnel" }, description: { ru: "Показывает источники, интерес и конверсию.", en: "Tracks sources, interest and conversion." }, connections: ["gh-messaging"] },
      { id: "gh-crm", layer: "external", row: 0, icon: "cloud", label: { ru: "CRM", en: "CRM" }, description: { ru: "Внешняя система работы с клиентами.", en: "External customer relationship system." }, connections: [] },
      { id: "gh-messaging", layer: "external", row: 1, icon: "app", label: { ru: "WhatsApp / Email", en: "WhatsApp / Email" }, description: { ru: "Каналы быстрой связи с покупателем.", en: "Fast communication channels with buyers." }, connections: [] },
    ],
  },
  {
    id: "chronos",
    name: "Chronos",
    subtitle: { ru: "Премиальный опыт выбора часов", en: "Luxury Watch Experience" },
    description: {
      ru: "Витрина часов соединяет каталог, премиальную визуальную подачу и путь к покупке или заявке.",
      en: "A watch storefront connecting catalog, premium presentation and purchase or inquiry intent.",
    },
    nodes: [
      { id: "ch-collectors", layer: "clients", row: 0, icon: "users", label: { ru: "Коллекционеры", en: "Collectors" }, description: { ru: "Покупатели, которые выбирают часы по стилю и статусу.", en: "Buyers choosing watches by style and status." }, connections: ["ch-catalog", "ch-product"] },
      { id: "ch-operators", layer: "clients", row: 1, icon: "users", label: { ru: "Команда магазина", en: "Store Team" }, description: { ru: "Команда, которая обновляет ассортимент и обрабатывает интерес.", en: "Team updating inventory and handling interest." }, connections: ["ch-console"] },
      { id: "ch-catalog", layer: "application", row: 0, icon: "monitor", label: { ru: "Каталог часов", en: "Watch Catalog" }, description: { ru: "Показывает коллекции, модели и визуальные подборки.", en: "Displays collections, models and visual selections." }, connections: ["ch-recommend", "ch-intent"] },
      { id: "ch-product", layer: "application", row: 1, icon: "app", label: { ru: "Карточка товара", en: "Product Detail" }, description: { ru: "Раскрывает ценность, детали и следующий шаг.", en: "Communicates value, detail and the next step." }, connections: ["ch-search", "ch-inquiry"] },
      { id: "ch-recommend", layer: "ai", row: 0, icon: "brain", label: { ru: "Рекомендации", en: "Recommendations" }, description: { ru: "Помогает подбирать часы по стилю и намерению.", en: "Helps match watches to style and intent." }, connections: ["ch-intent", "ch-products"] },
      { id: "ch-search", layer: "ai", row: 1, icon: "sparkles", label: { ru: "Поиск по коллекции", en: "Collection Search" }, description: { ru: "Упрощает навигацию по брендам и моделям.", en: "Simplifies navigation by brand and model." }, connections: ["ch-products", "ch-analytics"] },
      { id: "ch-intent", layer: "automation", row: 0, icon: "workflow", label: { ru: "Сигнал интереса", en: "Intent Flow" }, description: { ru: "Фиксирует просмотр, выбор и переход к заявке.", en: "Captures browsing, selection and inquiry intent." }, connections: ["ch-analytics", "ch-contact"] },
      { id: "ch-inquiry", layer: "automation", row: 1, icon: "bot", label: { ru: "Заявка / покупка", en: "Inquiry / Purchase" }, description: { ru: "Переводит интерес в контакт или транзакционный сценарий.", en: "Turns interest into contact or transaction flow." }, connections: ["ch-orders", "ch-payments"] },
      { id: "ch-products", layer: "data", row: 0, icon: "database", label: { ru: "Каталог товаров", en: "Product Data" }, description: { ru: "Хранит модели, описания, изображения и наличие.", en: "Stores models, descriptions, images and availability." }, connections: ["ch-payments"] },
      { id: "ch-analytics", layer: "data", row: 1, icon: "chart", label: { ru: "Аналитика интереса", en: "Intent Analytics" }, description: { ru: "Показывает, какие коллекции вызывают спрос.", en: "Shows which collections create demand." }, connections: ["ch-contact"] },
      { id: "ch-payments", layer: "external", row: 0, icon: "payments", label: { ru: "Платежи", en: "Payments" }, description: { ru: "Потенциальный внешний слой оплаты или резерва.", en: "Potential external checkout or reservation layer." }, connections: [] },
      { id: "ch-contact", layer: "external", row: 1, icon: "cloud", label: { ru: "Контакт-каналы", en: "Contact Channels" }, description: { ru: "Связь с покупателем после интереса к модели.", en: "Communication after buyer interest in a model." }, connections: [] },
    ],
  },
];

export const architectureProjects: ArchitectureProject[] = [
  ...coreArchitectureProjects,
  ...additionalArchitectureProjects,
];
