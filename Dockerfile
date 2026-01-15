# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --f --legacy-peer-deps

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g serve

# Copy only the built artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
