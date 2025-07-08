# DRS_Front/DRS_Front/Dockerfile

FROM node:20 as build

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
