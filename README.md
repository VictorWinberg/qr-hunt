# QR-Hunt

[![Build](https://github.com/VictorWinberg/qr-hunt/workflows/Build/badge.svg)](https://github.com/VictorWinberg/qr-hunt/actions?query=workflow%3ABuild+branch%3Amaster)

## Prerequisite

- Node v12
- Postgres v11.9

## Database Setup
```
createdb qrhunt
psql qrhunt < server/schema.sql
```

### Database clone production
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
