#Build stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm install -D typescript

COPY . .

RUN npm run build

RUN npm ci

EXPOSE 5000

CMD ["node", "dist/index.js"]