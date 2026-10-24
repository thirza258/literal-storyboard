# syntax=docker/dockerfile:1

# ---- serve -----------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 127.0.0.1, not localhost: nginx listens on IPv4 only, and inside the container
# `localhost` resolves to ::1 first, so the probe would be refused every time.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
