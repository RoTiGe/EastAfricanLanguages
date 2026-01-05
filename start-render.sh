#!/usr/bin/env bash
# Startup script for Render - runs both Python and Node.js services

# Start Python TTS service in background
python tts_service.py &

# Give Python service time to start
sleep 5

# Start Node.js Express server in foreground
node server.js
