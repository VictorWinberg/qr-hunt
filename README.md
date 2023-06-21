# QR-Hunt 2

[![Build](https://github.com/VictorWinberg/qr-hunt/workflows/Build/badge.svg)](https://github.com/VictorWinberg/qr-hunt/actions?query=workflow%3ABuild+branch%3Amaster)

## Prerequisite

- Node v12 (for backend)
- Node v14 (for frontend)
- Postgres v11

## Environment variables

There are two env-files that you need to create locally:
- one in root dir (path: `.env`) for backend
- one in client dir (path: `client/.env`) for frontend
> You can copy the `.env.example` to `.env` and modify the variables as needed

### Credentials

There is also a `credentials.json` file in the root dir.
> You can download it from https://console.cloud.google.com/apis/credentials under "Service Accounts"

## Server (Backend)

See [server/README.md](server/README.md).

## Frontend (Client)

See [client/README.md](client/README.md).

## Swagger UI | API Documentation
Visit `/api/docs`

## Sentry | Error Monitoring
Visit `sentry.io` (ask for invite)
