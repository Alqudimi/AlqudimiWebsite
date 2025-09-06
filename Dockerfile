# مرحلة البناء
FROM node:20-alpine AS build
WORKDIR /app

# نسخ ملفات البكج
COPY package*.json ./
RUN npm install

# نسخ بقية الملفات
COPY . .

# بناء الواجهة + السيرفر
RUN npm run build


# مرحلة التشغيل
FROM node:20-alpine AS production
WORKDIR /app

# نسخ ملفات dist من مرحلة البناء
COPY --from=build /app/dist ./dist
COPY package*.json ./

# تثبيت فقط dependencies الضرورية (بدون devDependencies)
RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/index.js"]