FROM node:8

WORKDIR /home/node
COPY --chown=node:node ./package*.json /home/node/

USER node
RUN npm install -s

COPY --chown=node:node . /home/node

ENV PORT=4000
ENV PATH="$PATH:./node_modules/.bin"

CMD node ./src/server.js
