// This will run when MongoDB initializes
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

// Create application user (this is separate from the root user)
db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
  roles: [
    { role: 'readWrite', db: process.env.MONGO_INITDB_DATABASE }
  ]
});

// Create initial collections
db.createCollection('users');
db.createCollection('pastNotify');
db.createCollection('kavitaNotifications');