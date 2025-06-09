# Ecolojia – Monorepo

## Backend

```bash
cd backend
cp .env.example .env   # remplis la DATABASE_URL
npm install
npx prisma db push
npm run dev
```

## Frontend

```bash
cd frontend
cp .env.example .env   # remplis les clés Algolia
npm install
npm run dev
```