FROM node:lts-alpine@sha256:a251de4db0e0632446c0ba62adbe1e37ff148a53732e4574d2ed0f5462cc4407 as build-stage

# default to development build mode
ARG MODE=development

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build -- --mode $MODE

FROM nginx:1.21.3-alpine as production-stage

RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080