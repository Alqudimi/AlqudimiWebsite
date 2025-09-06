
# Stage 1: Build the client-side application
FROM node:20-alpine AS client-builder
WORKDIR /app
COPY client ./client
COPY package.json vite.config.ts postcss.config.js tailwind.config.ts tsconfig.json components.json ./ 
RUN npm install
RUN npm run build

# Stage 2: Build the server-side application
FROM node:20-alpine AS server-builder
WORKDIR /app
COPY server ./server
COPY shared ./shared
COPY package.json tsconfig.json drizzle.config.ts ./ 
RUN npm install
RUN npm run build

# Stage 3: Setup Nginx and serve the application
FROM nginx:alpine
COPY --from=client-builder /app/dist /usr/share/nginx/html
COPY --from=server-builder /app/dist /usr/src/app
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


