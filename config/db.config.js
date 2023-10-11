require('dotenv').config();
const dev_env = process.env.NODE_ENV === `development`;

const dbConfig = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  NAME: process.env.DB_NAME,
  USER: process.env.DB_USER,
  PASS: process.env.DB_PASS,
};

var uri = dev_env ? `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.NAME}` : `mongodb://${dbConfig.USER}:${dbConfig.PASS}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.NAME}?authSource=admin`

module.exports = {
  uri
};
