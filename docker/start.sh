#!/bin/bash

echo "[start.sh] ==========================================="
echo "[start.sh] Medusa startup begin at $(date -Iseconds)"
echo "[start.sh] NODE_ENV=$NODE_ENV, PORT=$PORT"
echo "[start.sh] ==========================================="

DB_HOST=$(echo "$DATABASE_URL" | sed -E 's|.*@([^/]+)/.*|\1|' | sed 's|:[0-9]*||')
DB_PORT=$(echo "$DATABASE_URL" | sed -E 's|.*@[^:]+:([0-9]+)/.*|\1|' | head -1)
DB_NAME=$(echo "$DATABASE_URL" | sed -E 's|.*/([^?]+)(\?.*)?|\1|')
echo "[start.sh] Parsed DB host: $DB_HOST"
echo "[start.sh] Parsed DB port: ${DB_PORT:-5432}"
echo "[start.sh] Parsed DB name: $DB_NAME"

echo "[start.sh] --- Pre-flight: DNS resolution ---"
if timeout 5 nslookup "$DB_HOST" > /tmp/startup_dns.log 2>&1; then
    echo "[start.sh] DNS OK: $(cat /tmp/startup_dns.log | grep -E 'Name:|Address:' | head -5)"
else
    echo "[start.sh] DNS FAILED: $(cat /tmp/startup_dns.log)"
fi

echo "[start.sh] --- Pre-flight: TCP connectivity to $DB_HOST:${DB_PORT:-5432} ---"
if timeout 5 nc -zv "$DB_HOST" "${DB_PORT:-5432}" > /tmp/startup_nc.log 2>&1; then
    echo "[start.sh] TCP OK: $(cat /tmp/startup_nc.log)"
else
    echo "[start.sh] TCP FAILED: $(cat /tmp/startup_nc.log)"
fi

echo "[start.sh] --- Pre-flight: pg_isready ---"
PGARGS="-h $DB_HOST -p ${DB_PORT:-5432} -U postgres -d $DB_NAME"
if timeout 15 pg_isready $PGARGS > /tmp/startup_pg.log 2>&1; then
    echo "[start.sh] pg_isready OK: $(cat /tmp/startup_pg.log)"
else
    echo "[start.sh] pg_isready FAILED: $(cat /tmp/startup_pg.log)"
fi

echo "[start.sh] --- Pre-flight: psql query (3s timeout) ---"
PGCONNECT_TIMEOUT=3 timeout 10 psql $PGARGS -c "SELECT 1 as test;" > /tmp/startup_psql.log 2>&1
PG_RESULT=$?
if [ $PG_RESULT -eq 0 ]; then
    echo "[start.sh] psql OK: $(cat /tmp/startup_psql.log)"
else
    echo "[start.sh] psql FAILED (exit $PG_RESULT): $(cat /tmp/startup_psql.log)"
fi

echo "[start.sh] --- Starting Medusa CLI ---"
node ./node_modules/@medusajs/cli/dist/index.js start 2>&1 &
MEDUSA_PID=$!

echo "[start.sh] Medusa CLI PID: $MEDUSA_PID"
echo "[start.sh] Waiting for server on port 9000 (max 300s)..."

for i in $(seq 1 300); do
    if curl -sf --max-time 2 http://127.0.0.1:9000/health > /dev/null 2>&1; then
        echo "[start.sh] SUCCESS: Medusa ready on port 9000 after ${i}s"
        break
    fi
    if ! kill -0 $MEDUSA_PID 2>/dev/null; then
        echo "[start.sh] ERROR: Medusa process died at ${i}s"
        cat /tmp/startup_*.log 2>/dev/null
        break
    fi
    if [ $((i % 15)) -eq 0 ]; then
        echo "[start.sh] Still waiting... ${i}s (DB host: $DB_HOST)"
    fi
    sleep 1
done

echo "[start.sh] Keeping Medusa alive..."
wait $MEDUSA_PID
