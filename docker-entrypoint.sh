#!/bin/bash

set -e

if [[ "$DEV_SERVER" = "1" ]]; then
  # Start server
  yarn start
fi
