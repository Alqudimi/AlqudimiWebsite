FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:20-alpine AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

# ثبّت كل الـ dependencies (مع dev) حتى يلاقي vite إذا بقي import
RUN npm install --omit=optional

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/index.js"]