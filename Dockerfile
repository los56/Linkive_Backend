FROM node:19-alpine3.16 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:19-alpine3.16
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist .
COPY --from=build /usr/src/app/node_modules node_modules
COPY docker/.dockerenv .env
ENV NODE_ENV production

RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz
RUN tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz
EXPOSE 80

COPY docker/docker-entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh
ENTRYPOINT ./entrypoint.sh