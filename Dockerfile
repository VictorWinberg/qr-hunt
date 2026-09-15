FROM --platform=$BUILDPLATFORM node:16 AS build-client

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ ./
ARG VUE_APP_GOOGLE_API_KEY
ARG VUE_APP_VERSION
ENV VUE_APP_GOOGLE_API_KEY=$VUE_APP_GOOGLE_API_KEY
ENV VUE_APP_VERSION=$VUE_APP_VERSION
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev --ignore-scripts

COPY server/ ./server/
COPY --from=build-client /app/client/dist ./client/dist

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app/server
CMD ["node", "index"]
