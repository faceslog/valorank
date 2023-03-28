# Use the official Node.js image as the base image
FROM node:18.15

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the container's working directory
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the container's working directory
COPY . .

# =======================
# ENVIRONMENT VARIABLES
# =======================
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose the port your bot uses (e.g., 3000 for the Express.js callback)
EXPOSE $PORT

# Copy the entrypoint.sh file and make it executable
COPY entrypoint.sh /app
RUN chmod +x /app/entrypoint.sh

# Start the entrypoint.sh script
CMD ["/app/entrypoint.sh"]
