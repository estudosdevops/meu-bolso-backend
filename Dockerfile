#Build stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm install -D typescript

COPY . .

RUN npm ci

EXPOSE 5000

CMD ["sh", "-c", "npm run db:deploy && npm run prod"]