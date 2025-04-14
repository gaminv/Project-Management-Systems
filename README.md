# Avito PMS — Task Management System

Avito PMS — это система управления проектами с drag-and-drop досками задач, фильтрацией, поиском и возможностью управления задачами через модальные окна.

## 🔧 Технологии
> 📡 **API используется как основной способ взаимодействия между frontend и backend.** Все запросы на получение, создание, обновление и удаление задач и досок реализованы через HTTP API.

### Frontend
- **React ** — компонентный подход и экосистема.
- **Vite** — сверхбыстрая сборка и dev-сервер.
- **TypeScript** — строгая типизация.
- **React Query** — кэширование и работа с API.
- **React Router ** — маршрутизация страниц.
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
git clone https://github.com/gaminv/Project-Management-Systems.git
cd Project-Management-Systems
```

### Шаг 2: Запустить проект через Docker

```bash
docker-compose up --build
```

Frontend будет доступен на http://localhost:5173

Backend — на http://localhost:4000

## 🧪 Тестирование

Проект покрыт unit-тестами с использованием **Jest**, **React Testing Library**, **Mock Service Worker (MSW)** и **React Query Testing Utilities**.

✅ 100% покрытие кода:  
- Все ключевые модули (`api`, `hooks`) протестированы  
- Проверены edge-кейсы и асинхронное поведение
 ![image](https://github.com/user-attachments/assets/72c31835-28cf-4489-a065-298a73b76f2a)

  🛠 Для запуска:
```bash
cd client
npm install --save-dev jest @types/jest ts-jest jest-environment-jsdom
npm test
npm test -- --coverage
```

## 🖼 Скриншоты интерфейса
### 🗂 Все доски  
![image](https://github.com/user-attachments/assets/20fddd20-576e-47ba-8b58-15ea8785b8c0)

---

### 📋 Доска задач
![image](https://github.com/user-attachments/assets/6ce28816-416b-460f-84bf-d6fffa107447)

---

### ✅ Все задачи
![image](https://github.com/user-attachments/assets/a2b6abd8-6d1f-4152-8e44-59349311351a)

---

### ➕ Создание задачи
![image](https://github.com/user-attachments/assets/962c1bcb-d361-4be0-95f7-ee2d1e99fc18)

---

### ✏️ Редактирование задачи 
![image](https://github.com/user-attachments/assets/10a46a7d-e411-4232-9623-dbc2d0219281)


