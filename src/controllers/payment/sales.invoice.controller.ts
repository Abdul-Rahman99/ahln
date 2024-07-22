/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import SalesInvoiceModel from '../../models/payment/sales.invoice.model';
import asyncHandler from '../../middlewares/asyncHandler';
import {
  SalesInvoice,
  SalesInvoicePayload,
} from '../../types/sales.invoice.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import UserModel from '../../models/users/user.model';
import BoxModel from '../../models/box/box.model';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import NotificationModel from '../../models/logs/notification.model';

const notificationModel = new NotificationModel();
const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const salesInvoiceModel = new SalesInvoiceModel();
const userModel = new UserModel();
const boxModel = new BoxModel();

// Function to parse date from MM-DD-YYYY format
const parseDate = (dateString: string): Date | null => {
  const [month, day, year] = dateString.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? null : date;
};

export const createSalesInvoice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newSalesInvoicePayload: SalesInvoicePayload = req.body;

      const user = await authHandler(req, res, next);

      // Check if the user exists
      const userExist = await userModel.getOne(user);
      if (!userExist) {
        const user = await authHandler(req, res, next);
        const source = 'createSalesInvoice';
        systemLog.createSystemLog(user, 'User Not Found', source);
        return ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'));
      }

      const box = await boxModel.getOne(newSalesInvoicePayload.box_id);
      if (!box) {
        const user = await authHandler(req, res, next);
        const source = 'createSalesInvoice';
        systemLog.createSystemLog(user, 'Box Not Found', source);
        return ResponseHandler.badRequest(res, i18n.__('BOX_NOT_FOUND'));
      }

      // Parse the purchase_date from MM-DD-YYYY format
      const parsedDate = parseDate(newSalesInvoicePayload.purchase_date);
      if (!parsedDate) {
        const user = await authHandler(req, res, next);
        const source = 'createSalesInvoice';
        systemLog.createSystemLog(user, 'Invalid Date Format', source);
        return ResponseHandler.badRequest(res, i18n.__('INVALID_DATE_FORMAT'));
      }

      // Convert payload to SalesInvoice type
      const newSalesInvoice: SalesInvoice = {
        ...newSalesInvoicePayload,
        purchase_date: parsedDate,
      };

      const createdSalesInvoice = await salesInvoiceModel.createSalesInvoice(
        newSalesInvoice,
        user,
      );

      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICE_CREATED_SUCCESSFULLY'),
        createdSalesInvoice,
      );
      notificationModel.createNotification(
        'createSalesInvoice',
        i18n.__('SALES_INVOICE_CREATED_SUCCESSFULLY'),
        null,
        user,
      );
      const action = 'createSalesInvoice';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('SALES_INVOICE_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createSalesInvoice';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllSalesInvoices = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const salesInvoices = await salesInvoiceModel.getAllSalesInvoices();
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICES_RETRIEVED_SUCCESSFULLY'),
        salesInvoices,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getAllSalesInvoices';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getSalesInvoiceById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const salesInvoiceId = req.params.id;
      const salesInvoice = await salesInvoiceModel.getOne(salesInvoiceId);
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICE_RETRIEVED_SUCCESSFULLY'),
        salesInvoice,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getSalesInvoiceById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateSalesInvoice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const salesInvoiceId = req.params.id;
      const newSalesInvoicePayload: SalesInvoicePayload = req.body;
      // Parse the purchase_date from MM-DD-YYYY format
      const parsedDate = parseDate(newSalesInvoicePayload.purchase_date);
      if (!parsedDate) {
        const user = await authHandler(req, res, next);
        const source = 'updateSalesInvoice';
        systemLog.createSystemLog(user, 'Invalid Date Format', source);
        return ResponseHandler.badRequest(res, i18n.__('INVALID_DATE_FORMAT'));
      }

      // Convert payload to SalesInvoice type
      const newSalesInvoice: SalesInvoice = {
        ...newSalesInvoicePayload,
        purchase_date: parsedDate,
      };

      const updatedSalesInvoice = await salesInvoiceModel.updateOne(
        newSalesInvoice,
        salesInvoiceId,
      );
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICE_UPDATED_SUCCESSFULLY'),
        updatedSalesInvoice,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'updateSalesInvoice';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('SALES_INVOICE_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'updateSalesInvoice';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteSalesInvoice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const salesInvoiceId = req.params.id;
      const deletedSalesInvoice =
        await salesInvoiceModel.deleteOne(salesInvoiceId);
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICE_DELETED_SUCCESSFULLY'),
        deletedSalesInvoice,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'deleteSalesInvoice';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('SALES_INVOICE_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'deleteSalesInvoice';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getSalesInvoicesByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body.salesId;

      // Fetch sales invoices by user ID
      const salesInvoices =
        await salesInvoiceModel.getSalesInvoicesByUserId(user);

      // Send a success response
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICES_BY_USER_ID_RETRIEVED_SUCCESSFULLY'),
        salesInvoices,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getSalesInvoiceByUserId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getSalesInvoicesBySalesId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body.userId;

      // Fetch sales invoices by user ID
      const salesInvoices =
        await salesInvoiceModel.getSalesInvoicesByUserId(user);

      // Send a success response
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICES_BY_USER_ID_RETRIEVED_SUCCESSFULLY'),
        salesInvoices,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getSalesInvoicesBySalesId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getSalesInvoicesByBoxId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxId = req.params.boxId;
      const salesInvoices =
        await salesInvoiceModel.getSalesInvoicesByBoxId(boxId);
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'),
        salesInvoices,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getSalesInvoicesByBoxId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
