import { Express } from 'express';
import usersRoutes from './user/users.route';
import authRoute from './auth.route';
import roleRoute from './user/role.Route';
import permissionRoute from './user/permission.route';
import rolePermissionRoutes from './user/role.permission.route';
import userPermissionRoutes from './user/user.permission.route';
import tabletRoute from './box/tablet.route'

const mountRoutes = (app: Express) => {
  app.use('/api/users', usersRoutes);
  app.use('/api/auth', authRoute);
  app.use('/api/role', roleRoute);
  app.use('/api/permission', permissionRoute);
  app.use('/api/role-permissions', rolePermissionRoutes);
  app.use('/api/user-permissions', userPermissionRoutes);
  app.use('/api/tablet', tabletRoute);
  // app.use('/api/box', boxRoute);
};

export default mountRoutes;
