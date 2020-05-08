import express from 'express';

const app = express();

import connection from './database';
import routes from './routes/index.routes';

connection();

app.use(express.json());
app.use(routes);

export default app;
