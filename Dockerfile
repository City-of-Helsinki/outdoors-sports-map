# ===============================================
FROM node:18.12.1-bullseye-slim AS appbase
# ===============================================

RUN mkdir /app && chown -R node:node /app

WORKDIR /app

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# Global npm deps in a non-root user directory
ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin

COPY --chown=node:node docker-entrypoint.sh /entrypoint/docker-entrypoint.sh
ENTRYPOINT ["/entrypoint/docker-entrypoint.sh"]

# Copy package.json and package-lock.json/yarn.lock files
COPY --chown=node:node package*.json *yarn* ./

USER node

RUN yarn && yarn cache clean --force && chown -R node:node node_modules

# Use non-root user

# =============================
FROM appbase AS development
# =============================

ENV DEV_SERVER=1

# ===================================
FROM appbase AS staticbuilder
# ===================================

ARG REACT_APP_API_URL
ARG REACT_APP_DIGITRANSIT_API_URL
ARG REACT_APP_APP_NAME
ARG REACT_APP_SITE_WIDE_NOTIFICATION_ENABLED
ARG REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_FI
ARG REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_SV
ARG REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_EN
ARG REACT_APP_SITE_WIDE_NOTIFICATION_FI
ARG REACT_APP_SITE_WIDE_NOTIFICATION_SV
ARG REACT_APP_SITE_WIDE_NOTIFICATION_EN
ARG GENERATE_SITEMAP

COPY --chown=node:node . /app/.

RUN yarn build

# ===================================
FROM nginx:1.23.1 AS production
# ===================================

COPY --from=staticbuilder --chown=nginx:nginx /app/build /usr/share/nginx/html
COPY .prod/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
