import pino from "pino-http";
import pinoCore from "pino";

const config = {
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:dd-mm-yy HH:MM:ss",
      ignore: "pid,hostname",
      colorize:  process.env.NODE_ENV !== "production"
    },
  },
  enabled: process.env.NODE_ENV !== "test",
};

export const httpLogger = pino(config);
export const logger = pinoCore(config)
