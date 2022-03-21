FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

FROM node:16-alpine

ENV PORT=8880
ENV HOST=localhost
# ENV AWS_KEY=PASTE HERE YOUR KEY
# ENV AWS_SECRET=PASTE HERE YOUR KEY
# ENV AWS_BUCKET=PASTE HERE YOUR BACKET
ENV AWS_LOCATION=eu-west-3
ENV CLIENT_SERVICE_URL=http://client:8080/graphql

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /app/dist ./dist
EXPOSE 8880
CMD [ "npm", "run", "start:prod"]