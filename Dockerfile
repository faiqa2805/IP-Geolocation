# Use an official and lightweight Node base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package management files first to optimize Docker build caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of your application code (including public/ and views/)
COPY . .

# Expose the port your app runs on (from your app.js)
EXPOSE 3000

# Command to run the application
CMD [ "node", "app.js" ]