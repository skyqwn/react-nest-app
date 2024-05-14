# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # prod stage
# FROM node:18-alpine
# WORKDIR /app
# ARG NODE_ENV=production
# COPY --from=builder /app/dist ./dist
# COPY package*.json ./
# RUN npm install
# RUN rm package*.json
# EXPOSE 4000
# CMD ["node", "dist/main.js"]

# Base stage to install node deps

FROM --platform=linux/amd64 node:20-alpine AS base
WORKDIR /app

COPY package*.json ./

RUN npm ci

# Build stage to transpile `src` into `dist`

FROM base AS build

COPY --from=base package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY . .

RUN npm run build
# Final stage for production app image

FROM base AS production

ENV NODE_ENV="production"
ENV PORT=3000

COPY --from=build --chown=node:node package*.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

# Remove if you don't have public files
COPY --from=build --chown=node:node /app/public ./public
RUN mkdir -p /app/shared/public

EXPOSE 4000

CMD ["node", "dist/main.js"]