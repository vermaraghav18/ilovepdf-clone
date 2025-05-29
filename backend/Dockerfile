FROM node:18-slim 

WORKDIR /app 

# Create required directories 
RUN mkdir -p /app/outputs /app/test-output /app/temp_slides_1748496268054

# Install all system dependencies 
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

# Install global Node CLI tool
RUN npm install -g pdf2json

#  Copy app files
COPY . .

#  Install app dependencies
RUN npm install

#  Expose app port
EXPOSE 5000

#  Start server
CMD ["node", "server.js"]
