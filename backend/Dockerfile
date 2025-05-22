# ✅ Base image with Node.js
FROM node:18-slim

# ✅ Install Ghostscript
RUN apt-get update && apt-get install -y ghostscript && rm -rf /var/lib/apt/lists/*

# ✅ Create app directory
WORKDIR /app

# ✅ Copy package.json and install deps
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# ✅ Copy the rest of the app
COPY . .

# ✅ Expose port
EXPOSE 5000

# ✅ Start command
CMD ["node", "server.js"]
