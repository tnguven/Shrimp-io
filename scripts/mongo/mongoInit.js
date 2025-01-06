var adminDb = db.getSiblingDB('admin');

adminDb.auth('admin', 'secret');

adminDb.createUser({
  user: "developer",
  pwd: "secret",
  roles: [
    { role: 'dbOwner', db: 'shrimp' }, // Full access to the shrimp database
    { role: 'readWrite', db: 'admin' } // Optional: access to admin if needed
  ],
});

var shrimpDb = adminDb.getSiblingDB('shrimp');

shrimpDb.createCollection('shortUrls');

print('Initialization script executed successfully');
