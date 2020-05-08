import 'reflect-metadata';

import { createConnection, getConnectionOptions } from 'typeorm';

export default async function connection() {
  const connectionOptions = await getConnectionOptions();

  return await createConnection(connectionOptions)
    .then(() => console.log('Database Okay', connectionOptions.database))
    .catch((err) => console.log('Database error', err));
}
