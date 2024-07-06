/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
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
  async (req: Request, res: Response) => {
    try {
      const newSalesInvoicePayload: SalesInvoicePayload = req.body;

      // Check if the user exists
      const user = await userModel.getOne(newSalesInvoicePayload.customer_id);
      if (!user) {
        return ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'));
      }

      const box = await boxModel.getOne(newSalesInvoicePayload.box_id);
      if (!box) {
        return ResponseHandler.badRequest(res, i18n.__('BOX_NOT_FOUND'));
      }

      // Parse the purchase_date from MM-DD-YYYY format
      const parsedDate = parseDate(newSalesInvoicePayload.purchase_date);
      if (!parsedDate) {
        return ResponseHandler.badRequest(res, i18n.__('INVALID_DATE_FORMAT'));
      }

      // Convert payload to SalesInvoice type
      const newSalesInvoice: SalesInvoice = {
        ...newSalesInvoicePayload,
        purchase_date: parsedDate,
      };

      const createdSalesInvoice =
        await salesInvoiceModel.createSalesInvoice(newSalesInvoice);

      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICE_CREATED_SUCCESSFULLY'),
        createdSalesInvoice,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getAllSalesInvoices = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const salesInvoices = await salesInvoiceModel.getAllSalesInvoices();
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICES_RETRIEVED_SUCCESSFULLY'),
        salesInvoices,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getSalesInvoiceById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const salesInvoiceId = req.params.id;
      const salesInvoice = await salesInvoiceModel.getOne(salesInvoiceId);
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICE_RETRIEVED_SUCCESSFULLY'),
        salesInvoice,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const updateSalesInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const salesInvoiceId = req.params.id;
      const newSalesInvoicePayload: SalesInvoicePayload = req.body;
      // Parse the purchase_date from MM-DD-YYYY format
      const parsedDate = parseDate(newSalesInvoicePayload.purchase_date);
      if (!parsedDate) {
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
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const deleteSalesInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const salesInvoiceId = req.params.id;
      const deletedSalesInvoice =
        await salesInvoiceModel.deleteOne(salesInvoiceId);
      ResponseHandler.success(
        res,
        i18n.__('SALES_INVOICE_DELETED_SUCCESSFULLY'),
        deletedSalesInvoice,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getSalesInvoicesByUserId = asyncHandler(
  async (req: Request, res: Response) => {
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
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getSalesInvoicesBySalesId = asyncHandler(
  async (req: Request, res: Response) => {
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
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getSalesInvoicesByBoxId = asyncHandler(
  async (req: Request, res: Response) => {
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
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
