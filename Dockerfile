FROM node:16 AS build-client

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ ./
ARG VUE_APP_GOOGLE_API_KEY
ENV VUE_APP_GOOGLE_API_KEY=$VUE_APP_GOOGLE_API_KEY
RUN git init \
  && git config user.email "build@docker" \
  && git config user.name "Docker" \
  && git add -A \
  && git commit -m "build" -q \
  && git tag v0.0.0
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
