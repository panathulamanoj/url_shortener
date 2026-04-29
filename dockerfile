FROM node:18

WORKDIR / 

COPY package*.json ./

RUN npm install

copy . .

CMD ["node","server.js"]