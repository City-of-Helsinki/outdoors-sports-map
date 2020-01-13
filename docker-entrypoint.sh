#!/bin/bash

set -e

if [[ "$DEV_SERVER" = "1" ]]; then
  # Start server
  yarn start
else
  # Always default to production environment
  # Run nginx (as root) in foreground
  # https://github.com/nginxinc/docker-nginx/blob/04d0c5754673d6880b91e94c3cebaa767d9a1af7/Dockerfile#L20
  nginx -g 'daemon off;'
fi
