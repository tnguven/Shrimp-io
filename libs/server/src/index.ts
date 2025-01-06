import { server as serverConfig } from '@config';
import { connectDb } from '@db/mongoDb';
import { exitHandler } from '@utils/exit-handler';
import { logger } from "@log/logger"
import { app } from 'server';

void connectDb()
  .then(() => {
    const server = app.listen(serverConfig.PORT, () => {
      logger.info(`Listening ${serverConfig.PORT}`, { serverConfig });
    });
    exitHandler(() => {
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    logger.error("Something went wrong", err);
    process.kill(process.pid, 'exit');
  });
