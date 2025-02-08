# Stage 1: Build
FROM node:23 AS build
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install
COPY . .
# Build the project
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
# Copy the built files
COPY --from=build /app/dist /usr/share/nginx/html/dist
COPY --from=build /app/examples /usr/share/nginx/html
# Configure nginx to serve index.html from examples
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]