export function exitHandler(cb: () => void) {
  const handler = (err: Error) => {
    console.log('Server shutting down', err);
    cb();
  };

  process.on('uncaughtException', handler);
  process.on('unhandledRejection', handler);
  process.on('SIGTERM', handler);
  process.on('SIGINT', handler);
  process.on('SIGHUP', handler);
  process.on('exit', handler);
}
