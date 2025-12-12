# ===============================================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS appbase
# ===============================================

WORKDIR /app

USER root
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# Global npm deps in a non-root user directory
ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin

# Yarn
ENV YARN_VERSION=1.22.22
RUN yarn policies set-version $YARN_VERSION

RUN chown -R default:root /app

USER default

COPY --chown=default:root docker-entrypoint.sh /entrypoint/docker-entrypoint.sh
ENTRYPOINT ["/entrypoint/docker-entrypoint.sh"]

# Copy package.json and package-lock.json/yarn.lock files
COPY --chown=default:root package*.json *yarn* ./

USER default

RUN yarn && yarn cache clean --force && chown -R default:root node_modules

# Use non-root user

# =============================
FROM appbase AS development
# =============================

ENV DEV_SERVER=1

# ===================================
FROM appbase AS staticbuilder
# ===================================

ARG REACT_APP_API_URL
ARG REACT_APP_MAP_URL_TEMPLATE
ARG REACT_APP_DIGITRANSIT_API_URL
ARG REACT_APP_DIGITRANSIT_API_KEY
ARG REACT_APP_APP_NAME
ARG REACT_APP_SITE_WIDE_NOTIFICATION_ENABLED
ARG REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_FI
ARG REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_SV
ARG REACT_APP_SITE_WIDE_NOTIFICATION_TITLE_EN
ARG REACT_APP_SITE_WIDE_NOTIFICATION_FI
ARG REACT_APP_SITE_WIDE_NOTIFICATION_SV
ARG REACT_APP_SITE_WIDE_NOTIFICATION_EN
ARG GENERATE_SITEMAP

COPY --chown=default:root . /app/.

RUN yarn build

# ===================================
FROM registry.access.redhat.com/ubi9/nginx-124 AS production
# ===================================
# Add application sources to a directory that the assemble script expects them
# and set permissions so that the container runs without root access
USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
  chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/build /usr/share/nginx/html
# Copy nginx config
COPY .prod/nginx.conf /etc/nginx/nginx.conf

USER 1001

# Run script uses standard ways to run the application
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

EXPOSE 8080