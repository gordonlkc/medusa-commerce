#!/bin/bash

echo "[start.sh] Starting Medusa server on PORT=$PORT..."
echo "[start.sh] DATABASE_URL=${DATABASE_URL:0:30}..."

node ./node_modules/@medusajs/cli/dist/index.js start &
MEDUSA_PID=$!

echo "[start.sh] Medusa CLI PID: $MEDUSA_PID"
echo "[start.sh] Waiting for server to be ready..."

for i in $(seq 1 90); do
    if curl -sf --max-time 2 http://127.0.0.1:9000/health > /dev/null 2>&1; then
        echo "[start.sh] SUCCESS: Medusa ready on port 9000 after ${i}s"
        break
    fi
    if ! kill -0 $MEDUSA_PID 2>/dev/null; then
        echo "[start.sh] ERROR: Medusa process died after ${i}s"
        break
    fi
    sleep 1
done

echo "[start.sh] Keeping Medusa alive..."
wait $MEDUSA_PID
