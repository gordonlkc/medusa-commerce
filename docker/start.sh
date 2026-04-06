#!/bin/bash

# Run database migrations (idempotent)
echo "Running database migrations..."
node ./node_modules/@medusajs/cli/dist/index.js db:migrate 2>&1 || {
    echo "Migration failed, attempting to start anyway..."
}

# Seed the database (only on first run, safe to re-run)
echo "Seeding database..."
node ./node_modules/@medusajs/cli/dist/index.js seed 2>&1 || echo "Seed skipped (may already be seeded or not available)"

# Start the Medusa server
echo "Starting Medusa server..."
exec node ./node_modules/@medusajs/cli/dist/index.js start
