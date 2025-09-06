# مرحلة البناء
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# مرحلة الإنتاج
FROM nginx:stable-alpine

# مسح محتوى html الافتراضي
RUN rm -rf /usr/share/nginx/html/*

# نسخ ناتج البناء
COPY --from=build /app/dist /usr/share/nginx/html

# نسخ ملف إعدادات nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]