# Use official Node.js base image
FROM node:18-slim

# Install Ghostscript
RUN apt-get update && \
    apt-get install -y ghostscript && \
    apt-get clean

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Expose port (Render will use this)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
