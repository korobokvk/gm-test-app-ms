FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

FROM node:16-alpine

ENV PORT=8880
ENV HOST=localhost
ENV AWS_KEY=AKIAYAMZ26E6DQ3NO4QT
ENV AWS_SECRET=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
ENV AWS_BUCKET=gm-docs-bucket
ENV AWS_LOCATION=eu-west-3
ENV CLIENT_SERVICE_URL=http://client:3000/graphql

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /app/dist ./dist
EXPOSE 8880
CMD [ "npm", "start"]