import { resolve } from 'path';
import dotEnv from 'dotenv';

const isDevelopment = process.env.NODE_ENV !== 'production';

dotEnv.config({
  ...(isDevelopment && { path: resolve(__dirname, '../../../.env') }),
});

export const dataBase = <const>{
  dbName: process.env.MONGO_DATABASE || '',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  host: isDevelopment ? 'localhost' : process.env.MONGO_HOSTNAME || '',
  port: process.env.MONGO_PORT || '',
};

export const mongoURI =
  process.env.MONGO_URL ||
  `mongodb://${dataBase.username}:${encodeURIComponent(dataBase.password)}@${dataBase.host}:${
    dataBase.port
  }/${dataBase.dbName}`;

export const server = <const>{
  DOMAIN: process.env.DOMAIN || 'http://localhost',
  HOST: process.env.SERVER_HOST || 'http://localhost',
  PORT: process.env.SERVER_PORT || 8080,
};
