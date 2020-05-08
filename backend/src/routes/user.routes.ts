import express from 'express';
import multer from 'multer';

import UserController from '../controllers/UserController';
import FileController from '../controllers/FileController';

import AuthMiddleware from '../middlewares/auth';

import multerConfig from '../configs/multer';

const routes = express.Router();
const upload = multer(multerConfig);

routes.post('/', UserController.store);

routes.get('/', UserController.index);

routes.use(AuthMiddleware);

routes.put('/', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
