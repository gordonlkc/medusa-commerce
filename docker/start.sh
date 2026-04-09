#!/bin/bash
set -e

echo "Starting Medusa server..."
cd /app/backend/.medusa/server
exec node ./index.js
