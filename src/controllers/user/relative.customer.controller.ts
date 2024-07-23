/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import RelativeCustomerModel from '../../models/users/relative.customer.model';
import { RelativeCustomer } from '../../types/relative.customer.type';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import NotificationModel from '../../models/logs/notification.model';
import UserDevicesModel from '../../models/users/user.devices.model';

const userDevicesModel = new UserDevicesModel();
const notificationModel = new NotificationModel();
const systemLog = new SystemLogModel();
const auditTrail = new AuditTrailModel();
const relativeCustomerModel = new RelativeCustomerModel();

export const createRelativeCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const newRelaticeCustomerData: RelativeCustomer = req.body;
      const createdRelativeCustomer =
        await relativeCustomerModel.createRelativeCustomer(
          newRelaticeCustomerData,
        );
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_CREATED_SUCCESSFULLY'),
        createdRelativeCustomer,
      );
      const action = 'createRelativeCustomer';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('RELATIVE_CUSTOMER_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'createRelativeCustomer';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllRelativeCustomersByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const relativeCustomers = await relativeCustomerModel.getMany(user);
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMERS_RETRIEVED_SUCCESSFULLY'),
        relativeCustomers,
      );
    } catch (error: any) {
      const source = 'getAllRelativeCustomers';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getRelativeCustomerById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const relativeCustomerId = parseInt(req.params.id, 10);
      if (isNaN(relativeCustomerId)) {
        const source = 'getRelativeCustomerById';
        systemLog.createSystemLog(user, 'Invalid Card Id', source);
        return ResponseHandler.badRequest(res, i18n.__('INVALID_CARD_ID'));
      }
      const relativeCustomer =
        await relativeCustomerModel.getOne(relativeCustomerId);
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_RETRIEVED_SUCCESSFULLY'),
        relativeCustomer,
      );
    } catch (error: any) {
      const source = 'getRelativeCustomerById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateRelativeCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const relativeCustomerId = req.params.id;
      const newRelaticeCustomerData: RelativeCustomer = req.body;

      const updatedRelativeCustomer = await relativeCustomerModel.updateOne(
        newRelaticeCustomerData,
        Number(relativeCustomerId),
      );
      notificationModel.createNotification(
        'updateRelativeCustomer',
        i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
        null,
        user,
      );

      const action = 'updateRelativeCustomer';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
      );

      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('UPDATE_RELATIVE_CUSTOMER'),
          i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'updateRelativeCustomer';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
        updatedRelativeCustomer,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
      const source = 'updateRelativeCustomer';
      systemLog.createSystemLog(user, (error as Error).message, source);
      // next(error);
    }
  },
);

export const deleteRelativeCustomer = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const relativeCustomerId = req.params.id;
      const deletedRelativeCustomer = await relativeCustomerModel.deleteOne(
        Number(relativeCustomerId),
      );
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_DELETED_SUCCESSFULLY'),
        deletedRelativeCustomer,
      );

      notificationModel.createNotification(
        'deleteRelativeCustomer',
        i18n.__('RELATIVE_CUSTOMER_DELETED_SUCCESSFULLY'),
        null,
        user,
      );
      const action = 'deleteRelativeCustomer';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('RELATIVE_CUSTOMER_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'deleteRelativeCustomer';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
