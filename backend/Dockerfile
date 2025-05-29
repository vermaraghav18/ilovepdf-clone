FROM node:18-slim

# 1. Set working directory to /app/backend
WORKDIR /app/backend

# 2. Create required directories in /app scope (not backend)
RUN mkdir -p /app/outputs /app/test-output /app/temp_slides_1748496268054

# 3. Install system dependencies
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
    # 🔧 Fix ImageMagick security for PDFs
    sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' /etc/ImageMagick-6/policy.xml || true && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 4. Install global CLI (if needed)
RUN npm install -g pdf2json

# 5. Copy only the backend folder
COPY ./backend /app/backend

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false


RUN npm install --unsafe-perm
RUN npm rebuild puppeteer --force


# 6. Expose app port
EXPOSE 5000

# 7. Start server
CMD ["node", "server.js"]
