/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import RelativeCustomerModel from '../../models/users/relative.customer.model';
import { RelativeCustomer } from '../../types/relative.customer.type';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import NotificationModel from '../../models/logs/notification.model';

const notificationModel = new NotificationModel();
const systemLog = new SystemLogModel();
const auditTrail = new AuditTrailModel();
const relativeCustomerModel = new RelativeCustomerModel();

export const createRelativeCustomer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authHandler(req, res, next);
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
      const auditUser = await authHandler(req, res, next);
      const action = 'createRelativeCustomer';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('RELATIVE_CUSTOMER_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createRelativeCustomer';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllRelativeCustomers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the request headers
      const user = await authHandler(req, res, next);

      const relativeCustomers = await relativeCustomerModel.getMany(user);
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMERS_RETRIEVED_SUCCESSFULLY'),
        relativeCustomers,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getAllRelativeCustomers';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getRelativeCustomerById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const relativeCustomerId = parseInt(req.params.id, 10);
      if (isNaN(relativeCustomerId)) {
        const user = await authHandler(req, res, next);
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
      const user = await authHandler(req, res, next);
      const source = 'getRelativeCustomerById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateRelativeCustomer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const relativeCustomerId = req.params.id;
      const newRelaticeCustomer: RelativeCustomer = req.body;

      // Convert payload to SalesInvoice type
      const newRelativeCustomerData: RelativeCustomer = {
        ...newRelaticeCustomer,
      };

      const updatedSalesInvoice = await relativeCustomerModel.updateOne(
        newRelativeCustomerData,
        Number(relativeCustomerId),
      );
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
        updatedSalesInvoice,
      );
      const user = await authHandler(req, res, next);
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
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'updateRelativeCustomer';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteRelativeCustomer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
      const user = await authHandler(req, res, next);

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
      const user = await authHandler(req, res, next);
      const source = 'deleteRelativeCustomer';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
