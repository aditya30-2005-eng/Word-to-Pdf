
FROM node:18

RUN apt-get update && apt-get install -y libreoffice

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
