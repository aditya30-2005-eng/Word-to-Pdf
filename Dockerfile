# Node.js base image use karo
FROM node:18

# LibreOffice install karo
RUN apt-get update && apt-get install -y libreoffice

# App ke liye working directory
WORKDIR /app

# Package.json copy karo aur dependencies install karo
COPY package*.json ./
RUN npm install

# Baaki files copy karo
COPY . .

# Port expose karo (Render ke liye)
EXPOSE 5000

# Server run karo
CMD ["node", "index.js"]
