# syntax=docker/dockerfile:1

FROM node:18

WORKDIR /app

COPY ["./package.json", "./"] 

RUN npm install --verbose

COPY . .

ENV NODE_ENV=production

CMD [ "npm", "start" ]