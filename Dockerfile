# syntax=docker/dockerfile:1

# ---- build -----------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Vite inlines VITE_* variables at BUILD time, so the key has to arrive here as
# a build argument — setting it at runtime does nothing. It also means the key
# ends up in the image's JS bundle; see README before publishing an image.
ARG VITE_OPENROUTER_API_KEY=""
ENV VITE_OPENROUTER_API_KEY=$VITE_OPENROUTER_API_KEY

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- serve -----------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 127.0.0.1, not localhost: nginx listens on IPv4 only, and inside the container
# `localhost` resolves to ::1 first, so the probe would be refused every time.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
