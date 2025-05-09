# Use Node.js Image
FROM node:18-slim

# Set working directory.
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files.
COPY . .

# Expose working port.
EXPOSE 3000

# Set environment variable for production.
ENV NODE_ENV=production

#Start the server
CMD ["node", "app.js"]