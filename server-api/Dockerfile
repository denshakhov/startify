# Alpine images might have problems with native packages (it uses musl libc instead of glibc) so the slim image used instead
ARG NODE_VERSION=18.12.1-slim

# Development build
FROM node:${NODE_VERSION} AS development
USER node
WORKDIR /app
RUN mkdir /app/dist
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build
CMD ["node", "/app/dist/main.js"]

# Production build
# We also install curl, so that Heroku can send release logs
FROM node:${NODE_VERSION} AS production
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
USER node
WORKDIR /app
COPY --from=development /app/package.json /app/package-lock.json ./
RUN npm ci --production && npm cache clean --force && mkdir /app/dist
COPY --from=development /app/dist ./dist
CMD ["node", "/app/dist/main.js"]