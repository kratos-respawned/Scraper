# use node based image
FROM node:19-alpine
COPY package.json /app/
COPY  src /app/src
WORKDIR /app
RUN npm install
RUN npm run build
CMD [ "node","./dist/index.js" ]

