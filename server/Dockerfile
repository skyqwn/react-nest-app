FROM node:18-alpine as builder

ENV NODE_ENV prod

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

ENTRYPOINT npm run start:prod
