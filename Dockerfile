FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm config set strict-ssl false && npm install --legacy-peer-deps --no-audit --no-fund

COPY . .

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "dev"]
