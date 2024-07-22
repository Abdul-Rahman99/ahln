/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import DeliveryPackageModel from '../../models/delivery/delivery.package.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { DeliveryPackage } from '../../types/delivery.package.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import ShippingCompanyModel from '../../models/delivery/shipping.company.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import NotificationModel from '../../models/logs/notification.model';
import SystemLogModel from '../../models/logs/system.log.model';
import UserDevicesModel from '../../models/users/user.devices.model';

const userDevicesModel = new UserDevicesModel();
const notificationModel = new NotificationModel();
const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const shippingCompanyModel = new ShippingCompanyModel();
const deliveryPackageModel = new DeliveryPackageModel();

export const createDeliveryPackage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.tracking_number) {
        await deliveryPackageModel.checkTrackingNumber(
          req.body.tracking_number.toLowerCase(),
        );
      }

      const user = await authHandler(req, res, next);

      let shipping_company_id;
      try {
        shipping_company_id = await shippingCompanyModel.getShippingCompanyById(
          req.body.shipping_company_id,
        );
        if (!shipping_company_id) {
          req.body.other_shipping_company = req.body.shipping_company_id;
          req.body.shipping_company_id = null;
        }
      } catch (error: any) {
        req.body.other_shipping_company = req.body.shipping_company_id;
        req.body.shipping_company_id = null;
      }
      const newDeliveryPackage: Partial<DeliveryPackage> = req.body;
      const createdDeliveryPackage =
        await deliveryPackageModel.createDeliveryPackage(
          user,
          newDeliveryPackage,
        );

      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'),
        createdDeliveryPackage,
      );
      notificationModel.createNotification(
        'createDeliveryPackage',
        i18n.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'),
        null,
        user,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'createDeliveryPackage';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'),
      );
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('CREATE_DELIVERY_PACKAGE'),
          i18n.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'createDeliveryPackage';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createDeliveryPackage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllDeliveryPackages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryPackages = await deliveryPackageModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGES_RETRIEVED_SUCCESSFULLY'),
        deliveryPackages,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getAllDeliveryPackages';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getDeliveryPackageById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryPackageId = req.params.id;
      const deliveryPackage =
        await deliveryPackageModel.getOne(deliveryPackageId);
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_RETRIEVED_SUCCESSFULLY'),
        deliveryPackage,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getDeliveryPackageById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateDeliveryPackage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryPackageId = req.params.id;
      const deliveryPackageData: Partial<DeliveryPackage> = req.body;
      const user = await authHandler(req, res, next);

      try {
        if (req.body.shipping_company_id) {
          const shipping_company_id =
            await shippingCompanyModel.getShippingCompanyById(
              req.body.shipping_company_id,
            );
          if (!shipping_company_id) {
            req.body.other_shipping_company = req.body.shipping_company_id;
            req.body.shipping_company_id = null;
          } else {
            req.body.other_shipping_company = null;
          }
        }
      } catch (error: any) {
        req.body.other_shipping_company = req.body.shipping_company_id;
        req.body.shipping_company_id = null;
      }

      const updatedDeliveryPackage = await deliveryPackageModel.updateOne(
        deliveryPackageData,
        deliveryPackageId,
        user,
      );
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'),
        updatedDeliveryPackage,
      );
      notificationModel.createNotification(
        'updateDeliveryPackage',
        i18n.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'),
        null,
        user,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'updateDeliveryPackage';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'updateDeliveryPackage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteDeliveryPackage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryPackageId = req.params.id;
      const user = await authHandler(req, res, next);
      const deletedDeliveryPackage = await deliveryPackageModel.deleteOne(
        deliveryPackageId,
        user,
      );
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'),
        deletedDeliveryPackage,
      );
      notificationModel.createNotification(
        'deleteDeliveryPackage',
        i18n.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'),
        null,
        user,
      );
      const action = 'deleteDeliveryPackage';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'),
      );
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('DELETE_DELIVERY_PACKAGE'),
          i18n.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'deleteDeliveryPackage';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'deleteDeliveryPackage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

// Controller function to get all delivery packages for the current user
export const getUserDeliveryPackages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.query;

      const user = await authHandler(req, res, next);

      const deliveryPackages = await deliveryPackageModel.getPackagesByUser(
        user,
        status,
      );

      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGES_FETCHED_SUCCESSFULLY'),
        deliveryPackages,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getUserDeliveryPackages';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
