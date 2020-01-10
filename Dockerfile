# ===============================================
FROM helsinkitest/node:10-slim AS appbase
# ===============================================

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# Global npm deps in a non-root user directory
ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin

ENV YARN_VERSION 1.19.1
RUN yarn policies set-version $YARN_VERSION

COPY --chown=appuser:appuser docker-entrypoint.sh /entrypoint/docker-entrypoint.sh
ENTRYPOINT ["/entrypoint/docker-entrypoint.sh"]

# Use non-root user
USER appuser

# =============================
FROM appbase AS development
# =============================

ENV DEV_SERVER=1

# Copy package.json and package-lock.json/yarn.lock files
COPY --chown=appuser:appuser package*.json *yarn* ./

# Install npm depepndencies
ENV PATH /app/node_modules/.bin:$PATH

USER root
RUN apt-install.sh build-essential

USER appuser
RUN yarn && yarn cache clean --force

USER root
RUN apt-cleanup.sh build-essential

COPY --chown=appuser:appuser . /app/.

USER appuser
