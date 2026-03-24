# Stage 1: Dependencies
FROM node:20-alpine AS dependencies     #this can be named anything  dependenies of any thing

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate


# Stage 2: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/prisma ./prisma

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production


# Stage 3: Production
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy only necessary files
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nestjs:nodejs /app/package*.json ./

# Switch to non-root user
USER nestjs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["node", "dist/main.js"]