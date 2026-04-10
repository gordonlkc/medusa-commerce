#!/bin/bash

echo "[start.sh] Starting Medusa server..."
echo "[start.sh] Working directory: $(pwd)"

exec node ./node_modules/@medusajs/cli/dist/index.js start
