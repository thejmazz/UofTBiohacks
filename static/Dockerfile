FROM node:8

WORKDIR /home/node
COPY --chown=node:node ./package.json /home/node/

USER node
RUN npm install -s
