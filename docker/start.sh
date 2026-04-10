#!/bin/bash

echo "[start.sh] ==========================================="
echo "[start.sh] Medusa startup begin at $(date -Iseconds)"
echo "[start.sh] NODE_ENV=$NODE_ENV, PORT=$PORT"
echo "[start.sh] ==========================================="

DB_URL="$DATABASE_URL"
DB_HOST=$(echo "$DB_URL" | sed -E 's|.*@([^:/]+).*|\1|')
DB_PORT=$(echo "$DB_URL" | sed -E 's|.*@[^:]+:([0-9]+).*|\1|')
DB_NAME=$(echo "$DB_URL" | sed -E 's|.*/([^?]+)(\?.*)?|\1|')
DB_PORT="${DB_PORT:-5432}"

export PGPASSWORD="$DB_PASSWORD"

echo "[start.sh] DB host: $DB_HOST"
echo "[start.sh] DB port: $DB_PORT"
echo "[start.sh] DB name: $DB_NAME"

echo "[start.sh] --- Pre-flight: DNS ---"
if timeout 5 nslookup "$DB_HOST" > /tmp/startup_dns.log 2>&1; then
    echo "[start.sh] DNS OK: $(cat /tmp/startup_dns.log | head -10)"
else
    echo "[start.sh] DNS FAILED: $(cat /tmp/startup_dns.log)"
fi

echo "[start.sh] --- Pre-flight: TCP $DB_HOST:$DB_PORT ---"
if timeout 5 nc -zv "$DB_HOST" "$DB_PORT" > /tmp/startup_nc.log 2>&1; then
    echo "[start.sh] TCP OK: $(cat /tmp/startup_nc.log)"
else
    echo "[start.sh] TCP FAILED: $(cat /tmp/startup_nc.log)"
fi

echo "[start.sh] --- Pre-flight: pg_isready ---"
PGARGS="-h $DB_HOST -p $DB_PORT -U postgres -d $DB_NAME"
if timeout 15 pg_isready $PGARGS > /tmp/startup_pg.log 2>&1; then
    echo "[start.sh] pg_isready OK: $(cat /tmp/startup_pg.log)"
else
    echo "[start.sh] pg_isready FAILED: $(cat /tmp/startup_pg.log)"
fi

echo "[start.sh] --- Pre-flight: psql with PGPASSWORD ---"
if timeout 10 psql $PGARGS -c "SELECT 1 AS test" -w > /tmp/startup_psql.log 2>&1; then
    echo "[start.sh] psql OK: $(cat /tmp/startup_psql.log)"
else
    echo "[start.sh] psql FAILED (exit $?): $(cat /tmp/startup_psql.log)"
fi

echo "[start.sh] --- Starting Medusa CLI ---"

# Start medusa with output captured to a file AND stdout
node ./node_modules/@medusajs/cli/dist/index.js start \
    > /tmp/medusa_stdout.log \
    2>&1 &
MEDUSA_PID=$!

echo "[start.sh] Medusa CLI PID: $MEDUSA_PID"
echo "[start.sh] Waiting for server on port 9000 (max 300s)..."

for i in $(seq 1 300); do
    if curl -sf --max-time 2 http://127.0.0.1:9000/health > /dev/null 2>&1; then
        echo "[start.sh] SUCCESS: Medusa ready on port 9000 after ${i}s"
        echo "[start.sh] --- Medusa startup output ---"
        cat /tmp/medusa_stdout.log
        break
    fi
    if ! kill -0 $MEDUSA_PID 2>/dev/null; then
        echo "[start.sh] ERROR: Medusa process died at ${i}s"
        echo "[start.sh] --- Medusa stdout ---"
        cat /tmp/medusa_stdout.log
        break
    fi
    if [ $((i % 5)) -eq 0 ]; then
        # Every 5s: check if medusa has produced any output
        if [ -s /tmp/medusa_stdout.log ]; then
            echo "[start.sh] Medusa output so far (${i}s):"
            tail -5 /tmp/medusa_stdout.log | sed 's/^/[start.sh] /'
        fi
        echo "[start.sh] Still waiting... ${i}s (DB: $DB_HOST:$DB_PORT)"
    fi
    sleep 1
done

echo "[start.sh] Keeping Medusa alive..."
wait $MEDUSA_PID
