# Multi-stage Dockerfile for Satelite Delivery Frontend Web
# Stage 1: Build stage with Node.js
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Export web build using Expo
RUN npx expo export --platform web --output-dir dist

# Stage 2: Production stage with Nginx
FROM nginx:alpine

# Copy built web assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]