#!/bin/bash
MEDUSA_HEALTH="http://127.0.0.1:9000/health"
NEXTJS_HEALTH="http://127.0.0.1:8000/"
TIMEOUT=5
FAILED=0

if ! curl -sf --max-time "$TIMEOUT" "$MEDUSA_HEALTH" > /dev/null 2>&1; then
    echo "UNHEALTHY: Medusa backend not responding on port 9000" >&2
    FAILED=1
fi

if ! curl -sf --max-time "$TIMEOUT" -o /dev/null "$NEXTJS_HEALTH" 2>&1; then
    echo "UNHEALTHY: Next.js storefront not responding on port 8000" >&2
    FAILED=1
fi

if [ "$FAILED" -eq 1 ]; then
    exit 1
fi

echo "HEALTHY: Both Medusa and Next.js are responding"
exit 0
