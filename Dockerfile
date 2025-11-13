# --- build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --force --no-audit --no-fund
COPY . .
RUN npm run build

# --- production stage ---
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
# remove default nginx static files
RUN rm -rf ./*
COPY --from=builder /app/dist .
# custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
