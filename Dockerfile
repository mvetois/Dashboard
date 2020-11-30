FROM node:12-alpine

USER root
WORKDIR /home/app/

COPY . .

RUN npm install
# COPY . .

EXPOSE 8080

CMD ["npm", "start"]