FROM node:18-slim

# Accept build args
ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD

# Set working directory
WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ghostscript \
    poppler-utils \
    qpdf \
    libreoffice \
    unoconv \
    imagemagick \
    graphicsmagick \
    fonts-liberation \
    fonts-dejavu \
    libvips-dev \
    curl && \
    sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-6/policy.xml || true && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy backend files
COPY . /app/backend


# Install all dependencies in one layer (including puppeteer)
RUN npm install puppeteer@21.3.8 --save --force && \
    npm install --legacy-peer-deps

# Install dependencies
RUN npm install

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
