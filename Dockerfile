# Use Node.js as the base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of your source code
COPY . .

# Expose the default port (customize if different)
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]
