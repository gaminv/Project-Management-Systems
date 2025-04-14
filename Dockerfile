# Этап сборки
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап запуска через nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Дополнительно: (если хочешь добавить конфиг nginx)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
