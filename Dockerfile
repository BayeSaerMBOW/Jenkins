# base image
FROM node:20-alpine


# create app directory
WORKDIR /usr/src/app


# copy package.json and install (no dev deps)
COPY package.json ./
RUN npm ci --only=production || npm install --production


# copy app source
COPY . .


EXPOSE 3000


CMD ["node", "app.js"]  