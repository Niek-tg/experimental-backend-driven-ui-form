#!/bin/sh
set -eu

node /app/packages/backend/dist/index.js >> /proc/1/fd/1 2>> /proc/1/fd/2 &
BACKEND_PID=$!
NGINX_PID=""
BACKEND_PORT="${PORT:-3001}"

cleanup() {
  kill -TERM "$BACKEND_PID" 2>/dev/null || true
  if [ -n "${NGINX_PID:-}" ]; then
    kill -TERM "$NGINX_PID" 2>/dev/null || true
  fi
  wait "$BACKEND_PID" 2>/dev/null || true
  if [ -n "${NGINX_PID:-}" ]; then
    wait "$NGINX_PID" 2>/dev/null || true
  fi
}
trap cleanup TERM INT EXIT

backend_ready=0
for _ in $(seq 1 30); do
  if wget --no-verbose --tries=1 --spider "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1; then
    backend_ready=1
    break
  fi
  sleep 1
done

if [ "$backend_ready" -ne 1 ]; then
  echo "Backend failed to become healthy within startup timeout" >&2
  exit 1
fi

nginx -g 'daemon off;' &
NGINX_PID=$!

while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$NGINX_PID" 2>/dev/null; do
  sleep 1
done

if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
  echo "Backend process exited" >&2
elif ! kill -0 "$NGINX_PID" 2>/dev/null; then
  echo "Nginx process exited" >&2
fi

exit 1
