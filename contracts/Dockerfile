FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Install ts-node globally
RUN npm install -g ts-node

# Set environment variables
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Command to run the script
CMD ["npm", "run", "discover-proposals"] 