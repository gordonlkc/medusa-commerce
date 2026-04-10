#!/bin/bash
set -e

echo "[start.sh] Starting Medusa server..."
echo "[start.sh] Working directory: $(pwd)"
echo "[start.sh] Node version: $(node --version)"
echo "[start.sh] medusa-config.js exists: $(test -f ./medusa-config.js && echo yes || echo no)"
echo "[start.sh] medusa CLI exists: $(test -f ./node_modules/@medusajs/cli/dist/index.js && echo yes || echo no)"

exec node ./node_modules/@medusajs/cli/dist/index.js start 2>&1
