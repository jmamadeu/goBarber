import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();

import * as connection from './database';
import routes from './routes/index.routes';

connection.connectionMongo();
connection.connectionPostgre();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);

export default app;
