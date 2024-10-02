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
import favlistRoute from './delivery/dp.favlist.route';
import salesInvoiceRoute from './payment/sales.invoice.route';
import cardRoute from './payment/card.route';
import paymentRoute from './payment/payment.route';
import mobilePagesRoute from './adminstration/mobile.pages.route';
import boxScreenMessagesRoute from './adminstration/box.screen.messages.route';
import relativeCustomerRoute from './user/relative.customer.route';
import contactUsRoute from './adminstration/contact.us.route';
import auditTrailRoute from './logs/audit.trail.route';
import notificationRoute from './logs/notification.route';
import systemLogRoute from './logs/system.log.route';
import mqttTopicRoute from './logs/mqtt.topic.route';
import mqttLogRoute from './logs/mqtt.log.route';
import pinRoute from './user/pin.route';
import aboutUsRoute from './adminstration/about.us.route';
import userGuideRoute from './adminstration/user.guide.route';
import historyRoute from './user/history.route';
import countryRoute from './adminstration/country.route';
import cityRoute from './adminstration/city.route';
import playbackRoute from './logs/playback.route';
import offlineOTPsRoute from './delivery/offline.otps.route';
import { noToken, getToken } from '../controllers/extra.controller';

const mountRoutes = (app: Express) => {
  app.use('/api/users', usersRoutes);
  app.use('/api/auth', authRoute);

  app.use('/api/role', roleRoute);
  app.use('/api/permission', permissionRoute);
  app.use('/api/role-permissions', rolePermissionRoutes);
  app.use('/api/user-permissions', userPermissionRoutes);
  app.use('/api/relative-customer', relativeCustomerRoute);

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
  app.use('/api/fav-list', favlistRoute);

  app.use('/api/sales-invoice', salesInvoiceRoute);
  app.use('/api/payment-card', cardRoute);
  app.use('/api/payment', paymentRoute);

  app.use('/api/mobile-pages', mobilePagesRoute);
  app.use('/api/box-screen-messages', boxScreenMessagesRoute);
  app.use('/api/contact-us', contactUsRoute);

  app.use('/api/audit-trail', auditTrailRoute);
  app.use('/api/notification', notificationRoute);
  app.use('/api/system-log', systemLogRoute);
  app.use('/api/mqtt-topic', mqttTopicRoute);
  app.use('/api/mqtt-log', mqttLogRoute);

  app.use('/api/pin', pinRoute);

  app.use('/api/about-us', aboutUsRoute);
  app.use('/api/user-guide', userGuideRoute);

  app.use('/api/history', historyRoute);
  app.use('/api/country', countryRoute);
  app.use('/api/city', cityRoute);

  app.use('/api/playback', playbackRoute);

  app.use('/api/offline-otps', offlineOTPsRoute);

  app.use('/api/server-status', noToken);
  app.use('/api/check-token', getToken);
};

export default mountRoutes;
