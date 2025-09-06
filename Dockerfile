# مرحلة البناء
FROM node:20-alpine AS build
WORKDIR /app

# نسخ ملفات البكج أولاً
COPY package*.json ./
RUN npm install

# نسخ باقي الملفات
COPY . .

# بناء المشروع (يولد مجلد dist/)
RUN npm run build


# مرحلة الإنتاج مع nginx
FROM nginx:stable-alpine AS production

# مسح المحتوى الافتراضي
RUN rm -rf /usr/share/nginx/html/*

# نسخ ملفات البناء إلى nginx
COPY --from=build /app/dist /usr/share/nginx/html

# (اختياري) لو عندك SPA (React Router) أضف هذا الملف لإعادة التوجيه
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]