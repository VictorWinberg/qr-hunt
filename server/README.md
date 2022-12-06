# qr-hunt-server

## Prerequisite

- Node v12 (for backend)
- Postgres v11

## Database Setup
```
createdb qrhunt
psql qrhunt < schema.sql
```

### Database migrations
```
npm run db:migrate
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
