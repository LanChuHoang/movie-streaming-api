# syntax=docker/dockerfile:1

FROM node:18

ENV NODE_ENV=production

WORKDIR /app

COPY ["./api/package.json", "./api/package-lock.json", "./"] 

RUN npm install --production

COPY api .

CMD [ "npm", "start" ]