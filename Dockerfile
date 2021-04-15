# ===============================================
FROM helsinkitest/node:12-slim AS appbase
# ===============================================

# This image sets working directory to /app

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# Global npm deps in a non-root user directory
ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin

COPY --chown=appuser:appuser docker-entrypoint.sh /entrypoint/docker-entrypoint.sh
ENTRYPOINT ["/entrypoint/docker-entrypoint.sh"]

# Copy package.json and package-lock.json/yarn.lock files
COPY --chown=appuser:appuser package*.json *yarn* ./

USER root
RUN apt-install.sh build-essential

USER appuser
RUN yarn && yarn cache clean --force

USER root
RUN apt-cleanup.sh build-essential

# Use non-root user
USER appuser

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

COPY --chown=appuser:appuser . /app/.

RUN yarn build

# ===================================
FROM nginx:1.17 AS production
# ===================================

COPY --from=staticbuilder --chown=nginx:nginx /app/build /usr/share/nginx/html
COPY .prod/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
