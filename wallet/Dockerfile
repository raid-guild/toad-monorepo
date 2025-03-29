# Use Node.js LTS version as the base image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose any necessary ports (if needed)
# EXPOSE 3000

# Start the application
CMD ["npm", "start"] 