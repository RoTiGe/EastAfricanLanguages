# Use a base image that has both Python and Node.js
# The bullseye-slim variant is a good balance of size and compatibility
FROM nikolaik/python-nodejs:python3.11-nodejs20-bullseye

# Set working directory
WORKDIR /app

# Install system dependencies
# espeak-ng is required for some local TTS engines, though we use gTTS primarily.
# It's good to have as a fallback or for specific language support.
RUN apt-get update && apt-get install -y \
    espeak-ng \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./
COPY requirements.txt ./

# Install Node.js dependencies
RUN npm ci

# Install Python dependencies
# Upgrade pip first to avoid issues
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create necessary directories
# Render may overwrite /tmp, but we ensure our app uses /tmp/audio_output in production
# Creating these locally in the container ensuring permissions are correct
RUN mkdir -p audio_output public/uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV TTS_SERVICE_PORT=5000
ENV TTS_SERVICE_URL=http://localhost:5000

# Expose the port the app runs on
EXPOSE 3000

# Start script
# We use the existing start-render.sh but ensure it has execution permissions
RUN chmod +x start-render.sh

# Use the start script
CMD ["./start-render.sh"]
