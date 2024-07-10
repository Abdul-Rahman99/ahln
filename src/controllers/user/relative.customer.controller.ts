/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import RelativeCustomerModel from '../../models/users/relative.customer.model';
import UserModel from '../../models/users/user.model';
import { RelativeCustomer } from '../../types/relative.customer.type';

const userModel = new UserModel();
const relativeCustomerModel = new RelativeCustomerModel();

export const createRelativeCustomer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the request headers
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
      }

      // Find the user by the token
      const user = await userModel.findByToken(token);
      if (!user) {
        return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
      }
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
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getAllRelativeCustomers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const relativeCustomers = await relativeCustomerModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMERS_RETRIEVED_SUCCESSFULLY'),
        relativeCustomers,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getRelativeCustomerById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const relativeCustomerId = parseInt(req.params.id, 10);
      if (isNaN(relativeCustomerId)) {
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
      next(error);
      ResponseHandler.badRequest(res, error.message);
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
        i18n.__('SALES_INVOICE_UPDATED_SUCCESSFULLY'),
        updatedSalesInvoice,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
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
        i18n.__('OTP_DELETED_SUCCESSFULLY'),
        deletedRelativeCustomer,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
