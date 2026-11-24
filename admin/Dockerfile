# syntax=docker/dockerfile:1

ARG NODE_VERSION=18-alpine

FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
ARG REACT_APP_ADMIN_API=http://localhost:5000
ENV REACT_APP_ADMIN_API=${REACT_APP_ADMIN_API}
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
