# # FROM node:21-alpine3.19

# FROM node:20-buster

# RUN mkdir -p /opt/app

# WORKDIR /opt/app

# RUN npm i npm@latest -g

# COPY package.json package-lock.json ./

# RUN npm install

# # Cài đặt LibreOffice và pdftoppm
# RUN apk add --no-cache libreoffice libreoffice-common poppler-utils


# COPY . .

# EXPOSE 3000

# CMD ["sh", "-c", "npm run start"]

FROM node:21-alpine3.19

RUN mkdir -p /opt/app
WORKDIR /opt/app

RUN npm i npm@latest -g

COPY package.json package-lock.json ./
RUN npm install

# Cài đặt LibreOffice, pdftoppm và các font cần thiết trên Alpine
RUN apk add --no-cache \
    libreoffice \
    poppler-utils \
    fontconfig \
    ttf-dejavu \
    ttf-liberation \
    msttcorefonts-installer

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run start"]
