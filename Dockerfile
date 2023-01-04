FROM node:19.3

WORKDIR /cache-machine
COPY src/ /cache-machine/

RUN npm i

EXPOSE 3000

CMD ["npm", "start"]
