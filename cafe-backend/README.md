# Backend — вебсистема онлайн-замовлень у кав’ярні

Backend реалізований на JavaScript, Node.js, Express, PostgreSQL та Prisma.

## Структура

```text
cafe-backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   └── prisma.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── validators/
│   │   ├── auth.js
│   │   ├── order.js
│   │   └── product.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

## 1. PostgreSQL

Створи базу даних:

```sql
CREATE DATABASE cafe_orders;
```

## 2. Встановлення

```bash
npm install
```

Скопіюй `.env.example` у `.env` і перевір `DATABASE_URL` та `JWT_SECRET`.

## 3. Створення таблиць

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 4. Тестові дані

```bash
npm run seed
```

Тестовий адміністратор:

- email: `admin@cafe.local`
- пароль: `Admin123!`

Після першого запуску пароль бажано змінити.

## 5. Запуск

```bash
npm run dev
```

API буде доступне за адресою:

`http://localhost:5000`

Перевірка:

`GET /api/health`

## Основні API

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Products
- GET `/api/products`
- GET `/api/products/:id`
- GET `/api/products/categories`
- POST `/api/products` — admin
- PUT `/api/products/:id` — admin
- DELETE `/api/products/:id` — admin

### Orders
- POST `/api/orders`
- GET `/api/orders/my`
- GET `/api/orders` — admin
- PATCH `/api/orders/:id/status` — admin
