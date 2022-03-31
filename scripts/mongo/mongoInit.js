function getEnvVariable(envVar, defaultValue) {
  var command = run('sh', '-c', `printenv --null ${envVar} >/tmp/${envVar}.txt`);
  if (command != 0) return defaultValue;
  return cat(`/tmp/${envVar}.txt`).replace(/\0/g, '');
}

var dbName = getEnvVariable('MONGO_DATABASE', 'test');

db = db.getSiblingDB(dbName);

db.auth(
  getEnvVariable('MONGO_INITDB_ROOT_USERNAME', 'test'),
  getEnvVariable('MONGO_INITDB_ROOT_PASSWORD', 'test')
);

db.createUser({
  user: getEnvVariable('DB_USERNAME', 'test'),
  pwd: getEnvVariable('DB_PASSWORD', 'test'),
  roles: [{ role: 'dbOwner', db: dbName }],
});

db.createCollection('shortUrls');
