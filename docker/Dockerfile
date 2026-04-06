# ============================================================
# Stage 1: Build Next.js Storefront (standalone output)
# ============================================================
FROM node:22-alpine AS storefront-builder

RUN apk add --no-cache libc6-compat

WORKDIR /app/storefront

# Copy yarn config and vendored yarn before install
COPY apps/storefront/.yarnrc.yml apps/storefront/yarn.lock apps/storefront/package.json ./
COPY apps/storefront/.yarn/ ./.yarn/

# Install dependencies
RUN yarn install

# Copy source and build
COPY apps/storefront/ ./
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:8080
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_2da11164e3157d1443acb4cafb635ee47be3d434c0347201d9ca6d5b88270777
ENV NODE_ENV=production
RUN yarn build

# ============================================================
# Stage 2: Prepare Medusa Backend
# ============================================================
FROM node:22-alpine AS backend-builder

RUN apk add --no-cache python3 make g++

WORKDIR /app/backend

# Install dependencies
COPY apps/backend/.yarnrc.yml apps/backend/yarn.lock apps/backend/package.json ./
COPY apps/backend/.yarn/ ./.yarn/
RUN yarn install

# Copy source
COPY apps/backend/ ./
RUN yarn build

# ============================================================
# Stage 3: Final Runtime — Nginx + Supervisor + Both Apps
# ============================================================
FROM node:22-alpine AS runtime

RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    bash \
    tini

# --- Next.js Storefront ---
WORKDIR /app/storefront
COPY --from=storefront-builder /app/storefront/package.json ./
COPY --from=storefront-builder /app/storefront/node_modules ./node_modules
COPY --from=storefront-builder /app/storefront/.next/standalone ./
COPY --from=storefront-builder /app/storefront/.next/static ./.next/static
COPY --from=storefront-builder /app/storefront/public ./public

# --- Medusa Backend ---
WORKDIR /app/backend
COPY --from=backend-builder /app/backend/package.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/.medusa/server ./.medusa/server
# Use compiled JS config (ts-node can't resolve deps at runtime)
COPY --from=backend-builder /app/backend/.medusa/server/medusa-config.js ./medusa-config.js
# Copy admin build to where Medusa expects it (rootDirectory + "/public/admin")
COPY --from=backend-builder /app/backend/.medusa/server/public/admin ./public/admin
COPY --from=backend-builder /app/backend/src ./src

# --- Supervisor log directory ---
RUN mkdir -p /var/log/supervisor /run/nginx

# --- Nginx Configuration ---
COPY docker/nginx.conf /etc/nginx/nginx.conf

# --- Supervisor Configuration ---
COPY docker/supervisord.conf /etc/supervisor/supervisord.conf

# --- Health Check Script ---
COPY docker/health-check.sh /usr/local/bin/health-check.sh
RUN chmod +x /usr/local/bin/health-check.sh

# --- Medusa Startup Script (migrations + seed + start) ---
COPY docker/start.sh /app/backend/start.sh
RUN chmod +x /app/backend/start.sh

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
