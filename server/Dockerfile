# Pull Docker Hub base image
FROM node:16-alpine3.14

# ---------- Install app dependencies ----------
# Use Node's loading strategy:
#   https://nodejs.org/api/modules.html#loading-from-node_modules-folders
#   "If it is not found there, then it moves to the parent directory, and so on..."
# So we simply put node_modules in the parent folder

WORKDIR /usr/app
COPY package*.json ./
RUN npm install -y

# ---------- Copy app and run ----------
WORKDIR /usr/app/src
COPY . .
# Run the "dev" script in package.json
CMD ["npm", "run", "dev"]