import { Express } from 'express';
import usersRoutes from './users.route';
import authRoute from './auth.route';
import roleRoute from './role.route';
import permissionRoute from './permission.route';
import rolePermissionRoutes from './role.permission.route';
import userPermissionRoutes from './user.permission.route';
// import boxRoute from './box.route';

const mountRoutes = (app: Express) => {
  app.use('/api/users', usersRoutes);
  app.use('/api/auth', authRoute);
  app.use('/api/role', roleRoute);
  app.use('/api/permission', permissionRoute);
  app.use('/api/role-permissions', rolePermissionRoutes);
  app.use('/api/user-permissions', userPermissionRoutes);
  // app.use('/api/box', boxRoute);
};

export default mountRoutes;
