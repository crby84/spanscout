#!/bin/bash

echo "🚀 Starting SpanScout Dev Environment..."

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
tmux split-window -v
tmux send-keys "cd apps/demo-service && npm run dev" C-m

tmux select-layout tiled

tmux attach-session -t spanscout