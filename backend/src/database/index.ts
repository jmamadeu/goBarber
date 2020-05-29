import 'reflect-metadata';
import mongoose from 'mongoose';

import { createConnection, getConnectionOptions } from 'typeorm';

export async function connectionPostgre() {
  const connectionOptions = await getConnectionOptions();

  return await createConnection(connectionOptions)
    .then(() =>
      console.log('Database Okay Postgre', connectionOptions.database)
    )
    .catch((err) => console.log('Database error', err));
}

export async function connectionMongo() {
  return mongoose
    .connect(
      `mongodb://localhost:localhost@cluster0-shard-00-00-a0b4l.mongodb.net:27017,cluster0-shard-00-01-a0b4l.mongodb.net:27017,cluster0-shard-00-02-a0b4l.mongodb.net:27017/gobarber?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      }
    )
    .then(() => console.log('Database Okay Mongodb'))
    .catch((err) => console.log('Mongo error', err));
}
