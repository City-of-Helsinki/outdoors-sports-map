# ============================================================
# STAGE 1: Build the Static Assets
# ============================================================
FROM helsinki.azurecr.io/ubi9/nodejs-24-pnpm-builder-base AS appbase

COPY --chown=default:root package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=default:root ./public ./public
COPY --chown=default:root ./scripts ./scripts
COPY --chown=default:root index.html vite.config.ts tsconfig.json eslint.config.js ./
COPY --chown=default:root .env.example ./
COPY --chown=default:root ./src ./src

RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune

# ============================================================
# STAGE 2: Development
# ============================================================
FROM appbase AS development

WORKDIR /app

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

EXPOSE 3000

CMD ["pnpm", "start", "--port", "3000"]

# ============================================================
# STAGE 3: Static builder for production
# ============================================================
FROM appbase AS staticbuilder

ARG GENERATE_SITEMAP

RUN pnpm build

# ============================================================
# STAGE 4: Production Runtime
# ============================================================
FROM helsinki.azurecr.io/ubi9/nginx-126-spa-standard AS production

ARG REACT_APP_SENTRY_RELEASE
ENV APP_RELEASE=${REACT_APP_SENTRY_RELEASE:-""}

# 1. Copy the compiled assets
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# 2. Setup Runtime Env Injection
# env.sh is provided by the base image
WORKDIR /usr/share/nginx/html
COPY --from=staticbuilder /app/.env.runtime .env

# 3. Inject Versioning for the /readiness endpoint from package.json using base image
COPY package.json .

# 4. Copy Nginx configuration and startup script
COPY .prod/digitransit.conf.template /etc/nginx/templates/digitransit.conf.template
COPY .prod/start-nginx.sh /usr/local/bin/start-nginx.sh

CMD ["/bin/sh", "/usr/local/bin/start-nginx.sh", "nginx", "-g", "daemon off;"]


# - env.sh      (Inherited from base image at /usr/share/nginx/html/env.sh)
# - USER 1001   (Inherited from base image)
# - EXPOSE 8080 (Inherited from base image)
# - ENTRYPOINT  (Inherited from base image)