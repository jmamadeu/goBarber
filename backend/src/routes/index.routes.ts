import express from 'express';

import UserRoutes from './user.routes';
import SessionRoutes from './session.routes';

const routes = express.Router();

routes.use('/users', UserRoutes);
routes.use('/sessions', SessionRoutes);

export default routes;
