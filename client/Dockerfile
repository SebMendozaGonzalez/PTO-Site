# Stage 1: Build the React app
FROM node:20 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the app
FROM node:20-slim

# Set the working directory for serving
WORKDIR /app

# Install `serve` globally to serve the static files
RUN npm install -g serve

# Copy the build files from the builder stage
COPY --from=builder /app/build /app/build

# Expose the port the app runs on
EXPOSE 3000

# Command to serve the React app (correct path)
CMD ["serve", "-s", "build", "--single"]
