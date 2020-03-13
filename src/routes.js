import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileControlller from './app/controllers/FileControlller';
import ProviderController from './app/controllers/ProviderController';

import authMiddleware from './app/middlewares/auth';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
const upload = multer(multerConfig);

// GET (Pegar): essa operação é utilizada para buscar algo
// POST (Postar): essa operação é utilizada para criar algo
// PUT (Colocar): essa operação é utilizada para criar e alterar algo
// DELETE (Deletar): essa operação é utilizada para deletar algo

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);

routes.post('/files', upload.single('file'), FileControlller.store);

export default routes;
