import { server as serverConfig } from '@config';
import { connectDb } from '@db/mongoDb';
import { exitHandler } from '@utils/exitHandler';
import { app } from 'server';

void connectDb()
  .then(() => {
    const server = app.listen(serverConfig.PORT, () => {
      console.log(`Listening ${serverConfig.PORT}`);
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
    console.error(err);
    process.kill(process.pid, 'exit');
  });
