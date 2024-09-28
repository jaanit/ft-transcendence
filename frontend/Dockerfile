FROM node:20

RUN apt-get update

WORKDIR /client

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install && npm i sharp


COPY . .

RUN npm run build

CMD ["npm", "start"]
