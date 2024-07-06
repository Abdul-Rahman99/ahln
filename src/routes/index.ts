import { Express } from 'express';
import usersRoutes from './user/users.route';
import authRoute from './auth.route';
import roleRoute from './user/role.Route';
import permissionRoute from './user/permission.route';
import rolePermissionRoutes from './user/role.permission.route';
import userPermissionRoutes from './user/user.permission.route';
import tabletRoute from './box/tablet.route';
import userDevicesRoute from './user/user.device.route';
import boxGenerationRoute from './box/box.generation.route';
import addressRoute from './box/address.route';
import boxRoute from './box/box.route';
import boxLockerRoute from './box/box.locker.route';
import boxImageRoute from './box/box.image.route';
import userBoxRoute from './box/user.box.route';
import deliveryPackageRoute from './delivery/delivery.package.route';
import otpRoute from './delivery/otp.route';
import shippingCompanyRoute from './delivery/shipping.company.route';
import uploadImage from './delivery/image.route';
import salesInvoiceRoute from './payment/sales.invoice.route';
import cardRoute from './payment/card.route';
import paymentRoute from './payment/payment.route';

const mountRoutes = (app: Express) => {
  app.use('/api/users', usersRoutes);
  app.use('/api/auth', authRoute);

  app.use('/api/role', roleRoute);
  app.use('/api/permission', permissionRoute);
  app.use('/api/role-permissions', rolePermissionRoutes);
  app.use('/api/user-permissions', userPermissionRoutes);

  app.use('/api/user-devices', userDevicesRoute);

  app.use('/api/tablet', tabletRoute);
  app.use('/api/box-generation', boxGenerationRoute);
  app.use('/api/address', addressRoute);
  app.use('/api/box', boxRoute);
  app.use('/api/box-locker', boxLockerRoute);
  app.use('/api/box-image', boxImageRoute);
  app.use('/api/user-box', userBoxRoute);

  app.use('/api/delivery-package', deliveryPackageRoute);
  app.use('/api/otp', otpRoute);
  app.use('/api/shipping-company', shippingCompanyRoute);
  app.use('/api/image', uploadImage);

  app.use('/api/sales-invoice', salesInvoiceRoute);
  app.use('/api/payment-card', cardRoute);
  app.use('/api/payment', paymentRoute);
};

export default mountRoutes;
