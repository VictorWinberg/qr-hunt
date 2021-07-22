# QR-Hunt

[![Build](https://github.com/VictorWinberg/qr-hunt/workflows/Build/badge.svg)](https://github.com/VictorWinberg/qr-hunt/actions?query=workflow%3ABuild+branch%3Amaster)

## Prerequisite

- Node v12
- Postgres v11.9

## Environment variables

There are two env-files needed ...
- one in root dir `.env` (backend) 
- one in client dir `client/.env` (frontend)
> Please copy the `.env.example` and fill in the correct env vars for each .env-file

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
