FROM node:16-alpine3.14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# RUN npm run build
EXPOSE 7003
CMD ["npm", "run" , "start"]