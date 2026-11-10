FROM --platform=$BUILDPLATFORM node:16.20.2 AS build-client

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY client/ ./
ARG VUE_APP_GOOGLE_API_KEY
ARG VUE_APP_VERSION
ENV VUE_APP_GOOGLE_API_KEY=$VUE_APP_GOOGLE_API_KEY
ENV VUE_APP_VERSION=$VUE_APP_VERSION
RUN npm run build

FROM --platform=$BUILDPLATFORM node:22.23.3-alpine AS build-server-deps

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

FROM node:22.23.3-alpine

WORKDIR /app

COPY --from=build-server-deps /app/server/node_modules ./server/node_modules
COPY server/ ./server/
COPY --from=build-client /app/client/dist ./client/dist

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app/server
CMD ["node", "index"]
