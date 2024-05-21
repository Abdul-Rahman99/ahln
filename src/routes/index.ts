import { Request, Response, Express } from 'express';
import usersRoutes from './users.route';
import authRoute from './auth.route';

const mountRoutes = (app: Express) => {
  app.use('/api/users', usersRoutes);
  app.use('/api/auth', authRoute);
};

export default mountRoutes;
