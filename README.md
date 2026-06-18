# Den Workspace

Новый вертикальный лендинг Den Workspace: AI-системы, автоматизация, реальные проекты и форма связи.

## Стек

- Next.js 16 App Router
- TypeScript
- React 19
- Lucide icons
- Resend

## Локальный запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Сайт будет доступен по адресу [http://localhost:3000](http://localhost:3000).

## Переменные окружения

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

Без этих значений лендинг работает полностью, но отправка контактной формы возвращает состояние ненастроенного почтового сервиса.

## Проверка

```bash
npm run lint
npm run build
```
