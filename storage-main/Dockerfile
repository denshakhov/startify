ARG NODE_VERSION=16.15-slim

# Development build
FROM node:${NODE_VERSION} AS development
WORKDIR /app
RUN mkdir /app/dist && chown -R node:node /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build

# Production build
FROM node:${NODE_VERSION} AS production
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN chown -R node:node /app
COPY --chown=node:node --from=development /app/package.json /app/package-lock.json ./
RUN npm ci --production && npm cache clean --force
COPY --chown=node:node --from=development /app/dist ./dist
USER node
CMD ["npm", "run", "migrate:latest"]