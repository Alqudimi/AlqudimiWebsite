# مرحلة البناء
FROM node:20-alpine AS build
WORKDIR /app

# نسخ ملفات البكج أولاً عشان الكاش
COPY package*.json ./
# إذا عندك pnpm-lock.yaml انسخه برضه
COPY pnpm-lock.yaml ./ || true

RUN npm ci

# نسخ بقية الملفات
COPY . .

# بناء المشروع
RUN npm run build

# مرحلة الإنتاج مع nginx
FROM nginx:stable-alpine AS production

# حذف الملفات الافتراضية
RUN rm -rf /usr/share/nginx/html/*

# نسخ ملفات البناء
COPY --from=build /app/dist /usr/share/nginx/html

# فتح البورت
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]