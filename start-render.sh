#!/usr/bin/env bash
# Startup script for Render - runs both Python and Node.js services

echo "Starting deployment script..."

# Start Python TTS service in background using Gunicorn for production stability
# Bind to 0.0.0.0 to ensure it's accessible (though localhost is sufficient for inter-process)
echo "Starting Python TTS service on port 5000..."
gunicorn -b 0.0.0.0:5000 tts_service:app --log-file - &

# Wait for Python service to be ready
echo "Waiting for TTS service to initialize..."
for i in {1..30}; do
    if curl -s http://localhost:5000/health > /dev/null; then
        echo "✅ TTS service is ready!"
        break
    fi
    echo "Waiting for TTS service... ($i/30)"
    sleep 2
done

# Start Node.js Express server in foreground
echo "Starting Node.js server..."
node server.js
