FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 4000

CMD ["node", "dist/index.js"]
