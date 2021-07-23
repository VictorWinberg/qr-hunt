# QR-Hunt

[![Build](https://github.com/VictorWinberg/qr-hunt/workflows/Build/badge.svg)](https://github.com/VictorWinberg/qr-hunt/actions?query=workflow%3ABuild+branch%3Amaster)

## Prerequisite

- Node v12
- Postgres v11

## Environment variables

There are two env-files that you need to create locally:
- one in root dir (path: `.env`) for backend
- one in client dir (path: `client/.env`) for frontend
> You can copy the `.env.example` to `.env` and modify the variables as needed

## Database Setup
```
createdb qrhunt
psql qrhunt < server/schema.sql
```

### Database clone production (optional)
```
npm run db:pull
```

## Node Setup

```
npm install
npm start
```

## Swagger UI
Visit `/api/docs`
