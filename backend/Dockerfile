FROM node:18
# Set the working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build your React app (assuming you have a build script in your package.json)
RUN npm run build

# Install serve globally (if you really need to; you can also run it locally later)
RUN npm install -g serve

# Expose the port that the application will run on
EXPOSE 3000

# Start the React app with serve
CMD ["serve", "-s", "build"]