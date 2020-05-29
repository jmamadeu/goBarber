import express from 'express';
import multer from 'multer';

import FileController from '../controllers/FileController';
import UserController from '../controllers/UserController';
import SessionController from '../controllers/SessionController';
import ScheduleController from '../controllers/ScheduleController';
import ProviderController from '../controllers/ProviderController';
import AvailableController from '../controllers/AvailableController';
import AppointmentController from '../controllers/AppointmentController';
import NotificationController from '../controllers/NotificationController';

import multerConfig from '../configs/multer';
import authMiddleware from '../middlewares/auth';

const routes = express.Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:id/available', AvailableController.index);

routes.get('/schedulers', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
