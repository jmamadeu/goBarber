import express from 'express';
import cors from 'cors';

const app = express();

import connection from './database';
import routes from './routes/index.routes';

connection();

app.use(cors());
app.use(express.json());
app.use(routes);

export default app;
