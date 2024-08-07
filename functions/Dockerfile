FROM node:18-alpine as build

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

FROM --platform=linux/arm64 node:18-alpine
COPY /.env .env
COPY --from=build /app/dist dist

CMD ["node", "dist"]
