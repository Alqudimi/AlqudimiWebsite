FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
# تثبيت كل شيء بما فيها الـ optional
RUN npm install --include=optional

COPY . .
RUN npm run build


FROM node:20-alpine AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./

# تثبيت فقط اللي يحتاجه السيرفر (بدون dev لكن مع optional)
RUN npm install --omit=dev --include=optional

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/index.js"]