FROM node:18-slim

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
COPY ./backend /app/backend

# Install dependencies
RUN npm install

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
