# QR-Hunt

[![Build](https://github.com/VictorWinberg/qr-hunt/workflows/Build/badge.svg)](https://github.com/VictorWinberg/qr-hunt/actions?query=workflow%3ABuild+branch%3Amaster)

## Prerequisite

- Node (macOS: `brew install node`)
- Postgres (macOS: `brew install postgres`)

## Database Setup
```
createdb qrhunt
psql qrhunt < server/schema.sql
```

## Node Setup

```
npm install
npm start
```

## Swagger UI
Visit `/api/docs`
