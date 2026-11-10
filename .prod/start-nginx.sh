#!/bin/sh
set -eu

: "${DIGITRANSIT_API_KEY:?Set the server-only DIGITRANSIT_API_KEY environment variable}"
case "$DIGITRANSIT_API_KEY" in
    *[!A-Za-z0-9_-]*)
        printf '%s\n' 'DIGITRANSIT_API_KEY contains unsupported characters' >&2
        exit 1
        ;;
esac

: "${DIGITRANSIT_API_URL:=https://api.digitransit.fi/geocoding/v1}"
if ! printf '%s\n' "$DIGITRANSIT_API_URL" | grep -Eq '^https://[A-Za-z0-9.-]+(:[0-9]+)?(/[A-Za-z0-9._~/-]*)?$'; then
    printf '%s\n' 'DIGITRANSIT_API_URL must be an HTTPS base URL without credentials, query parameters, or fragments' >&2
    exit 1
fi
DIGITRANSIT_API_URL=${DIGITRANSIT_API_URL%/}
DIGITRANSIT_API_HOST=${DIGITRANSIT_API_URL#https://}
DIGITRANSIT_API_HOST=${DIGITRANSIT_API_HOST%%/*}
export DIGITRANSIT_API_URL DIGITRANSIT_API_HOST

umask 077
envsubst '${DIGITRANSIT_API_KEY} ${DIGITRANSIT_API_URL} ${DIGITRANSIT_API_HOST}' \
    < /etc/nginx/templates/digitransit.conf.template \
    > /etc/nginx/includes/digitransit.conf

exec "$@"