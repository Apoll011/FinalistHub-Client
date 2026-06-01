# Build stage
FROM node:20-alpine as builder

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./

RUN npm ci

COPY . .

# Use .env from Docker build context
ARG VITE_API_URL=https://finalisthub-server.onrender.com
ARG VITE_MODE=production

RUN npm run build

USER appuser

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]