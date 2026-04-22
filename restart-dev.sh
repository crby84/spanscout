#!/bin/bash

set -e

echo "🔁 Restarting SpanScout Dev Environment..."

# 1. Stoppen
echo "🛑 Stopping existing services..."
if tmux has-session -t spanscout 2>/dev/null; then
    tmux kill-session -t spanscout
    echo "🧠 tmux session stopped"
else
    echo "ℹ️ No tmux session running"
fi

# 2. Docker stoppen
echo "📦 Stopping Docker..."
cd infra/docker
docker compose down

# kleine Pause damit Ports wirklich frei sind
sleep 2

# 3. Docker wieder starten
echo "📦 Starting Docker..."
docker compose up -d

cd ../../

# kleine Pause für DB / Services
sleep 3

# 4. tmux Session neu starten
echo "🚀 Starting services in tmux..."

tmux new-session -d -s spanscout

tmux send-keys -t spanscout "cd infra/docker && docker compose up -d" C-m

tmux split-window -h
tmux send-keys "cd apps/control-plane && npm run start:dev" C-m

tmux split-window -v
tmux send-keys "cd apps/ingestion-gateway && npm run dev" C-m

tmux select-pane -t 0
tmux split-window -v
tmux send-keys "cd apps/worker-service && npm run dev" C-m

tmux select-pane -t 1
tmux select-pane -t 1
tmux send-keys "cd apps/demo-service && npm run dev" C-m

tmux select-layout tiled
echo "✅ Restart complete"
echo "👉 Attaching to tmux..."

tmux attach-session -t spanscout