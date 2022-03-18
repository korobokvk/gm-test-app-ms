export const config = () => ({
  port: process.env.PORT,
  host: process.env.HOST,
  AWS_KEY: process.env.AWS_KEY,
  AWS_SECRET: process.env.AWS_SECRET,
  AWS_BUCKET: process.env.AWS_BUCKET,
  AWS_LOCATION: process.env.AWS_LOCATION,
  CLIENT_SERVICE_URL: process.env.CLIENT_SERVICE_URL,
});
