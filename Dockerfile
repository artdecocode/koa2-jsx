FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

# set the argument default
ARG NODE_ENV=production

# assign it to an environment variable
# we can wrap the variable in brackets
ENV NODE_ENV ${NODE_ENV}

CMD [ "npm", "run", "example" ]
