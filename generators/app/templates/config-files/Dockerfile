FROM node:8.11.0

# Override the base log level (info).
ENV NPM_CONFIG_LOGLEVEL warn

# Install all dependencies of the current project.
COPY package.json package.json
RUN npm install

# Copying source files
COPY . .

# Build for production.
RUN npm run build

# Running the app
CMD [ "npm", "start" ]