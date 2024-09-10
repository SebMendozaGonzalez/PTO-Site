# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app
RUN npm run build

# Serve the app using a static server
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Command to serve the React app
CMD ["serve", "-s", "build"]