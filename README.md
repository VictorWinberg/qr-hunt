# QR-Hunt

[![Build](https://github.com/VictorWinberg/qr-hunt/workflows/Build/badge.svg)](https://github.com/VictorWinberg/qr-hunt/actions?query=workflow%3ABuild+branch%3Amaster)

## Prerequisite

- Node v22 (for backend)
- Node v14 (for frontend)
- Postgres v11

## Environment variables

Create a root `.env` file for local development (backend runtime and frontend build-time variables).
> Copy `.env.example` to `.env` and modify the variables as needed

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
