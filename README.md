# Avito PMS — Task Management System

Avito PMS — это система управления проектами с drag-and-drop досками задач, фильтрацией, поиском и возможностью управления задачами через модальные окна.

## 🔧 Технологии

### Frontend
- **React 18** — компонентный подход и экосистема.
- **Vite** — сверхбыстрая сборка и dev-сервер.
- **TypeScript** — строгая типизация.
- **React Query** — кэширование и работа с API.
- **React Router v6** — маршрутизация страниц.
- **@hello-pangea/dnd** — drag-and-drop интерфейс доски задач.
- **SASS** — модульные стили с вложенностью и переменными.

### Backend
- **Golang** — высокая производительность, лаконичный синтаксис.
- **SQLite** — встроенная БД, идеально подходит для небольших проектов.
- **Chi Router** — легковесный HTTP роутер.

### Инфраструктура
- **Docker + Docker Compose** — контейнеризация, простота запуска и деплоя.

## 📁 Структура проекта

```
pms-app/
│
├── client/                   # frontend на React
│   ├── components/           # переиспользуемые компоненты UI (Header, TaskModal и т.д.)
│   ├── pages/                # страницы: BoardPage, IssuesPage и т.д.
│   ├── api/                  # хуки и запросы к API (React Query)
│   ├── types/                # глобальные типы: Task, User, Board и др.
│   ├── contexts/             # контексты, например TaskModalContext
│   ├── styles/               # SASS/SCSS стили
│   └── main.tsx             # точка входа фронтенда
│
├── server/                   # backend на Go
│   ├── cmd/                  # основная точка входа приложения
│   ├── handlers/             # HTTP-хендлеры для CRUD операций
│   ├── models/               # модели данных и логика
│   ├── db/                   # инициализация и миграции SQLite
│   └── routes.go             # маршруты chi
│
├── docker-compose.yml        # запуск client + server
├── README.md                 # документация
└── .env                      # переменные окружения
```

## 🚀 Как запустить проект

### Шаг 1: Клонировать репозиторий

```bash
git clone https://github.com/your-username/pms-app.git
cd pms-app
```

### Шаг 2: Запустить проект через Docker

```bash
docker-compose up --build
```

Frontend будет доступен на [`http://localhost:3000`](http://localhost:3000)

Backend — на [`http://localhost:8080`](http://localhost:8080)

## 🖼 Скриншоты

### 📋 Доска задач
![Доска задач](client/screenshots/board.png)

### ✅ Все задачи
![Все задачи](client/screenshots/issues.png)

### ➕ Модалка создания задачи
![Модалка](client/screenshots/task-modal.png)
