/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
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
// import UserDevicesModel from '../../models/users/user.devices.model';
import BoxModel from '../../models/box/box.model';
import UserBoxModel from '../../models/box/user.box.model';

const userBoxModel = new UserBoxModel();
const boxModel = new BoxModel();
// const userDevicesModel = new UserDevicesModel();
const notificationModel = new NotificationModel();
const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const shippingCompanyModel = new ShippingCompanyModel();
const deliveryPackageModel = new DeliveryPackageModel();

export const createDeliveryPackage = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      // check if the user related to box
      const userRelatedToBox = await userBoxModel.checkUserBox(
        user,
        req.body.box_id,
      );
      if (!userRelatedToBox) {
        const source = 'createDeliveryPackage';
        const message = i18n.__('USER_NOT_RELATED_TO_BOX');
        systemLog.createSystemLog(user, message, source);
        return ResponseHandler.badRequest(res, message);
      }

      if (req.body.tracking_number) {
        await deliveryPackageModel.checkTrackingNumber(
          req.body.tracking_number.toLowerCase(),
          req.body.box_id,
        );
      }

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

      notificationModel.createNotification(
        'createDeliveryPackage',
        i18n.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'),
        null,
        user,
        newDeliveryPackage.box_id as string,
      );
      const action = 'createDeliveryPackage';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'),
        newDeliveryPackage.box_id as string,
      );
      // const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      // try {
      //   notificationModel.pushNotification(
      //     fcmToken,
      //     i18n.__('CREATE_DELIVERY_PACKAGE'),
      //     i18n.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'),
      //   );
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // } catch (error: any) {
      //   const source = 'createDeliveryPackage';
      //   systemLog.createSystemLog(
      //     user,
      //     i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
      //     source,
      //   );
      // }
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'),
        createdDeliveryPackage,
      );
    } catch (error: any) {
      const source = 'createDeliveryPackage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllDeliveryPackages = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const deliveryPackages = await deliveryPackageModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGES_RETRIEVED_SUCCESSFULLY'),
        deliveryPackages,
      );
    } catch (error: any) {
      const source = 'getAllDeliveryPackages';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getDeliveryPackageById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

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
      const source = 'getDeliveryPackageById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateDeliveryPackage = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const deliveryPackageId = req.params.id;
      const deliveryPackageData: Partial<DeliveryPackage> = req.body;

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

      notificationModel.createNotification(
        'updateDeliveryPackage',
        i18n.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'),
        null,
        user,
        deliveryPackageData.box_id as string,
      );
      const action = 'updateDeliveryPackage';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'),
        deliveryPackageData.box_id as string,
      );
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'),
        updatedDeliveryPackage,
      );
    } catch (error: any) {
      const source = 'updateDeliveryPackage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteDeliveryPackage = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const deliveryPackageId = req.params.id;
      const deletedDeliveryPackage =
        await deliveryPackageModel.deleteOne(deliveryPackageId);

      notificationModel.createNotification(
        'deleteDeliveryPackage',
        i18n.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'),
        null,
        user,
        deletedDeliveryPackage.box_id,
      );
      const action = 'deleteDeliveryPackage';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'),
        deletedDeliveryPackage.box_id,
      );
      // const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      // try {
      //   notificationModel.pushNotification(
      //     fcmToken,
      //     i18n.__('DELETE_DELIVERY_PACKAGE'),
      //     i18n.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'),
      //   );
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // } catch (error: any) {
      //   const source = 'deleteDeliveryPackage';
      //   systemLog.createSystemLog(
      //     user,
      //     i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
      //     source,
      //   );
      // }
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'),
        deletedDeliveryPackage,
      );
    } catch (error: any) {
      const source = 'deleteDeliveryPackage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

// Controller function to get all delivery packages for the current user
export const getUserDeliveryPackages = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const { boxId, status } = req.query;

      const boxRelatedToUser = await boxModel.getOneByUser(
        user,
        boxId as string,
      );

      if (!boxRelatedToUser) {
        const source = 'getUserDeliveryPackages';
        systemLog.createSystemLog(user, 'Box Does Not Exist', source);
        return ResponseHandler.badRequest(res, i18n.__('BOX_DOES_NOT_EXIST'));
      }
      const deliveryPackages = await deliveryPackageModel.getPackagesByUser(
        user,
        boxId as string,
        status,
      );

      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGES_FETCHED_SUCCESSFULLY'),
        deliveryPackages,
      );
    } catch (error: any) {
      const source = 'getUserDeliveryPackages';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const transferDeliveryPackages = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const { fromBoxId, toBoxId } = req.body;
      const fromBoxRelatedToUser = await boxModel.getOneByUser(user, fromBoxId);
      const toBoxRelatedToUser = await boxModel.getOneByUser(user, toBoxId);

      if (!fromBoxRelatedToUser && !toBoxRelatedToUser) {
        const source = 'transferDeliveryPackages';
        systemLog.createSystemLog(
          user,
          'from Box Does Not Belong To User',
          source,
        );
        return ResponseHandler.badRequest(
          res,
          i18n.__('FROM_BOX_DOES_NOT_BELONG_TO_USER'),
        );
      }
      const deliveryPackages =
        await deliveryPackageModel.transferDeliveryPackages(
          fromBoxId,
          toBoxId,
          user,
        );

      notificationModel.createNotification(
        'transferDeliveryPackages',
        i18n.__('DELIVERY_PACKAGES_TRANSFERRED_SUCCESSFULLY'),
        null,
        user,
        toBoxId,
      );
      const action = 'transferDeliveryPackages';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('DELIVERY_PACKAGES_TRANSFERRED_SUCCESSFULLY'),
        fromBoxId,
      );
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGES_TRANSFERRED_SUCCESSFULLY'),
        deliveryPackages,
      );
    } catch (error: any) {
      const source = 'transferDeliveryPackages';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
