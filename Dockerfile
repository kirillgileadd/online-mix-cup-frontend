# --- build stage ---
FROM node:22-alpine AS builder
ARG VITE_ENVOY_API_URL
ARG VITE_TELEGRAM_BOT_USERNAME
ARG VITE_NODE_ENV
ENV VITE_ENVOY_API_URL=${VITE_ENVOY_API_URL}
ENV VITE_NODE_ENV=${VITE_NODE_ENV}
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --force --no-audit --no-fund
COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:22-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
