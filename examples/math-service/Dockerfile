FROM node:14.15.4-alpine3.10 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN rm -rf src tsconfig.json

RUN npm prune --production

FROM node:14.15.4-alpine3.10

COPY --from=build /app /app
WORKDIR /app
ENV NODE_ENV=production


ENTRYPOINT ["node", "./node_modules/@keawade/framethework/dist/bin/framethework-runner.js", "./dist/MathService.js"]
