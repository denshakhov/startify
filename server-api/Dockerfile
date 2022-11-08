# Alpine images might have problems with native packages (it uses musl libc instead of glibc) so the slim image used instead
ARG NODE_VERSION=18.12-slim

# Development build
FROM node:${NODE_VERSION} AS development
WORKDIR /app
RUN mkdir /app/dist && chown -R node:node /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build
USER node
CMD ["node", "/app/dist/main.js"]

# Production build
# We also install curl, so that Heroku can send release logs
FROM node:${NODE_VERSION} AS production
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN chown -R node:node /app
COPY --chown=node:node --from=development /app/package.json /app/package-lock.json ./
RUN npm ci --production && npm cache clean --force
COPY --chown=node:node --from=development /app/dist ./dist
USER node
CMD ["node", "/app/dist/main.js"]