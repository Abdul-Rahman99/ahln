/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import PaymentModel from '../../models/payment/payment.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Payment } from '../../types/payment.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import CardModel from '../../models/payment/card.model';
import UserModel from '../../models/users/user.model';

const cardModel = new CardModel();
const paymentModel = new PaymentModel();
const userModel = new UserModel();

const parseBillingDate = (dateString: string): Date | null => {
  const [month, day, year] = dateString.split('-');
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? null : date;
};

export const createPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPayment: Payment = req.body;
      const billingDate = parseBillingDate(
        newPayment.billing_date as unknown as string,
      );
      if (!billingDate) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('INVALID_BILLING_DATE_FORMAT'),
        );
      }
      newPayment.billing_date = billingDate;

      const card = await cardModel.getCardById(newPayment.card_id);
      if (!card) {
        throw new Error(`No Card Found, please add a card`);
      }
      const createdPayment = await paymentModel.createPayment(newPayment);
      ResponseHandler.success(
        res,
        i18n.__('PAYMENT_CREATED_SUCCESSFULLY'),
        createdPayment,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const getAllPayments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await paymentModel.getAllPayments();
      ResponseHandler.success(
        res,
        i18n.__('PAYMENTS_RETRIEVED_SUCCESSFULLY'),
        payments,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) {
        return ResponseHandler.badRequest(res, i18n.__('INVALID_PAYMENT_ID'));
      }
      const payment = await paymentModel.getPaymentById(paymentId);
      ResponseHandler.success(
        res,
        i18n.__('PAYMENT_RETRIEVED_SUCCESSFULLY'),
        payment,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const updatePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) {
        return ResponseHandler.badRequest(res, i18n.__('INVALID_PAYMENT_ID'));
      }

      const paymentData: Partial<Payment> = req.body;

      if (paymentData.billing_date) {
        const billingDate = parseBillingDate(
          paymentData.billing_date as unknown as string,
        );
        if (!billingDate) {
          return ResponseHandler.badRequest(
            res,
            i18n.__('INVALID_BILLING_DATE_FORMAT'),
          );
        }
        paymentData.billing_date = billingDate;
      }

      const updatedPayment = await paymentModel.updatePayment(
        paymentId,
        paymentData,
      );
      ResponseHandler.success(
        res,
        i18n.__('PAYMENT_UPDATED_SUCCESSFULLY'),
        updatedPayment,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const deletePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) {
        return ResponseHandler.badRequest(res, i18n.__('INVALID_PAYMENT_ID'));
      }
      const deletedPayment = await paymentModel.deletePayment(paymentId);
      ResponseHandler.success(
        res,
        i18n.__('PAYMENT_DELETED_SUCCESSFULLY'),
        deletedPayment,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const getPaymentsByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the request headers
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
      }

      const user = await userModel.findByToken(token);

      if (!user) {
        return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
      }
      const payments = await paymentModel.getPaymentsByUser(user);
      ResponseHandler.success(
        res,
        i18n.__('PAYMENTS_RETRIEVED_SUCCESSFULLY'),
        payments,
      );
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);
