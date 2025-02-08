# Build 
FROM node:23 AS build
WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .

RUN npm run build

# Serve
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]