FROM node:19.3 as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY cache-machine-server/package*.json ./

RUN npm ci

COPY cache-machine-server/ .

RUN npm run build

FROM node:slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY cache-machine-server/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD [ "node", "dist/app.js" ]
