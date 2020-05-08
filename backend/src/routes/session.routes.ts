import express from 'express';
import SessionController from '../controllers/SessionController';

const routes = express.Router();

routes.post('/', SessionController.store);

export default routes;
