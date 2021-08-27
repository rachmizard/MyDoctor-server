FROM node:14

WORKDIR /app

COPY package*.json ./

COPY . /app

RUN npm install

RUN npm run build

EXPOSE 4000

CMD ["node", "./build/index.js"]