FROM node:20

RUN apt-get update && \
    apt-get install -y postgresql-client

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install -g @nestjs/cli

RUN npm install nest

COPY . .

RUN chmod +x script.sh

EXPOSE 8000

ENTRYPOINT [ "./script.sh" ]
CMD npm run start:prod
