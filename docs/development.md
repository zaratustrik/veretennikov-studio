# Development

## Требования

- Node.js 20+
- npm 10+
- Git

## Локальный запуск

```bash
git clone https://github.com/zaratustrik/veretennikov-studio.git
cd veretennikov-studio
npm install
npm run dev       # http://localhost:3000
```

## Основные команды

```bash
npm run dev       # dev-сервер с hot reload
npm run build     # production сборка
npm run start     # запуск production-сборки локально
npm run lint      # проверка ESLint
```

## Структура проекта

```
src/
├── app/
│   ├── (public)/               # Публичная зона сайта
│   │   ├── layout.tsx          # Header + Footer + PageTransition
│   │   ├── page.tsx            # Главная
│   │   ├── services/           # Задачи → решения
│   │   ├── cases/              # Портфолио с фильтром
│   │   ├── about/              # О студии
│   │   ├── manifesto/          # Манифест
│   │   └── contact/            # Связаться
│   ├── show/[slug]/            # Страницы показа кейсов (без auth)
│   │   ├── layout.tsx          # Минимальный layout
│   │   └── page.tsx            # Страница кейса
│   ├── globals.css             # Дизайн-токены, keyframes
│   └── layout.tsx              # Root layout (html, meta)
│
├── components/
│   └── public/
│       ├── Header.tsx          # Навигация + мобильное меню
│       ├── Footer.tsx
│       ├── HeroDiagram.tsx     # CSS/SVG анимация на главной
│       ├── PageTransition.tsx  # Framer Motion переход между страницами
│       ├── FadeIn.tsx          # Scroll-reveal компонент
│       └── CasesFilter.tsx     # Фильтр кейсов (client component)
│
├── data/
│   └── cases.ts                # Статические данные кейсов (→ БД в будущем)
│
└── (планируется)
    ├── app/project/[id]/       # Клиентский портал
    ├── app/admin/              # Панель студии
    ├── app/api/                # Route handlers
    └── lib/                    # db.ts, r2.ts, email.ts, auth.ts
```

## Зоны сайта

| Зона | URL | Auth |
|------|-----|------|
| Публичная | `/`, `/services`, `/cases`, `/about`, `/manifesto`, `/contact` | Нет |
| Страницы показа | `/show/[slug]` | Нет |
| Клиентский портал | `/project/[id]` | Magic Link |
| Админ-панель | `/admin` | NextAuth |

## Кейсы (данные)

Сейчас данные статические в `src/data/cases.ts`. При добавлении нового кейса:

```ts
// src/data/cases.ts
{
  id: "client-slug",
  slug: "client-slug",
  client: "Название клиента",
  title: "Название проекта",
  description: "Краткое описание",
  type: "video" | "ai" | "synthesis",
  year: 2024,
  services: ["Сценарий", "Съёмка", "Монтаж"],
  challenge: "Описание задачи (необязательно)",
  solution: "Описание решения (необязательно)",
  outcome: "Результат (необязательно)",
}
```

После добавления в массив страница `/show/[slug]` создаётся автоматически (SSG).

## Дизайн-токены

Определены в `src/app/globals.css` как CSS-переменные:

```css
--bg-base      /* #0A0A0A — основной фон */
--bg-surface   /* #111111 — поверхности, карточки */
--bg-raised    /* #161616 — hover-состояния */
--border       /* #1E1E1E — границы */
--border-mid   /* #2A2A2A — заметные границы */
--text-1       /* #EEEAE4 — основной текст */
--text-2       /* #777777 — вторичный текст */
--text-3       /* #3A3A3A — приглушённый текст */
```

## Переменные окружения

Файл `.env.local` (не в git). Понадобится когда подключим БД:

```env
DATABASE_URL=        # Timeweb PostgreSQL connection string
NEXTAUTH_SECRET=     # Случайная строка для NextAuth
NEXTAUTH_URL=        # https://veretennikov.info
RESEND_API_KEY=      # Для email-уведомлений
R2_ACCOUNT_ID=       # Timeweb S3
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```
