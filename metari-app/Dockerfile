# Build the app
FROM node:24-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ja no nessesitem node, montem el projecte en un nginx
FROM nginx:alpine

#vite uses dist instead of build
# COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]