#!/bin/bash

echo "[start.sh] Starting Medusa server..."
echo "[start.sh] Working directory: $(pwd)"
echo "[start.sh] Node version: $(node --version)"
echo "[start.sh] medusa-config.js: $(test -f ./medusa-config.js && echo exists || echo MISSING)"

node ./node_modules/@medusajs/cli/dist/index.js start &
MEDUSA_PID=$!

echo "[start.sh] Medusa started with PID $MEDUSA_PID"
echo "[start.sh] Waiting for port 9000..."

for i in $(seq 1 60); do
    if curl -s --max-time 2 http://127.0.0.1:9000/health > /dev/null 2>&1; then
        echo "[start.sh] Port 9000 is open after ${i} seconds!"
        echo "[start.sh] Health check: $(curl -s http://127.0.0.1:9000/health)"
        break
    fi
    sleep 1
done

if ! kill -0 $MEDUSA_PID 2>/dev/null; then
    echo "[start.sh] ERROR: Medusa process died!"
    exit 1
fi

echo "[start.sh] Medusa is running. Keeping process alive..."
wait $MEDUSA_PID
