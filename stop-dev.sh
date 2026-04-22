#!/bin/bash

echo "🛑 Stopping SpanScout Dev Environment..."

# 1. tmux Session stoppen (falls vorhanden)
if tmux has-session -t spanscout 2>/dev/null; then
    echo "🧠 Killing tmux session (spanscout)..."
    tmux kill-session -t spanscout
else
    echo "ℹ️ No tmux session found"
fi

# 2. Docker stoppen
echo "📦 Stopping Docker stack..."
cd infra/docker || exit
docker compose down

cd ../../

echo "✅ SpanScout stopped successfully"