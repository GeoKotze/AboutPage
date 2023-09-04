FROM node:14.15.4-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm install -g nodemon


EXPOSE 8080

CMD ["nodemon", "app.js"]

