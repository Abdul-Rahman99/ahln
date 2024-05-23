import { Request, Response, Express } from 'express';
import usersRoutes from './users.route';
import authRoute from './auth.route';
import boxRoute from './box.route';
import vendorRoute from './vendor.route'

const mountRoutes = (app: Express) => {
  app.use('/api/users', usersRoutes);
  app.use('/api/auth', authRoute);
  app.use('/api/box', boxRoute);
  app.use('/api/vendor', vendorRoute);
};

export default mountRoutes;
