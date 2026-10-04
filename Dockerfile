FROM --platform=$BUILDPLATFORM node:22.23.3-alpine AS build-client

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ ./
ARG VITE_APP_GOOGLE_API_KEY
ARG VITE_APP_VERSION
ENV VITE_APP_GOOGLE_API_KEY=$VITE_APP_GOOGLE_API_KEY
ENV VITE_APP_VERSION=$VITE_APP_VERSION
RUN npm run build-only

FROM node:22.23.3-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev --ignore-scripts

COPY server/ ./server/
COPY --from=build-client /app/client/dist ./client/dist

ENV NODE_ENV=production
EXPOSE 3000

WORKDIR /app/server
CMD ["node", "index"]
