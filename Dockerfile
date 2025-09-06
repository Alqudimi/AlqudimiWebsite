# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["bash", "./start.sh"]

