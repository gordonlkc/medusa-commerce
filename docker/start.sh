#!/bin/bash
set -e

echo "Starting Medusa server..."
exec node ./node_modules/@medusajs/cli/dist/index.js start
