/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import PaymentModel from '../../models/payment/payment.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Payment } from '../../types/payment.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import CardModel from '../../models/payment/card.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import NotificationModel from '../../models/logs/notification.model';
import SystemLogModel from '../../models/logs/system.log.model';

const notificationModel = new NotificationModel();
const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const cardModel = new CardModel();
const paymentModel = new PaymentModel();

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
        const user = await authHandler(req, res, next);
        const source = 'createPayment';
        systemLog.createSystemLog(user, 'Invalid Billing Date Format', source);
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
      const user = await authHandler(req, res, next);
      const createdPayment = await paymentModel.createPayment(newPayment, user);
      ResponseHandler.success(
        res,
        i18n.__('PAYMENT_CREATED_SUCCESSFULLY'),
        createdPayment,
      );
      notificationModel.createNotification(
        'checkOTP',
        i18n.__('OTP_VERIFIED_SUCCESSFULLY'),
        null,
        user,
      );
      const action = 'createPayment';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('PAYMENT_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createPayment';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
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
      const user = await authHandler(req, res, next);
      const source = 'getAllPayments';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) {
        const user = await authHandler(req, res, next);
        const source = 'getPaymentById';
        systemLog.createSystemLog(user, 'Invalid Payment Id', source);
        return ResponseHandler.badRequest(res, i18n.__('INVALID_PAYMENT_ID'));
      }
      const payment = await paymentModel.getPaymentById(paymentId);
      ResponseHandler.success(
        res,
        i18n.__('PAYMENT_RETRIEVED_SUCCESSFULLY'),
        payment,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getPaymentById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const updatePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authHandler(req, res, next);

      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) {
        const user = await authHandler(req, res, next);
        const source = 'updatePayment';
        systemLog.createSystemLog(user, 'Invalid Payment Id', source);
        return ResponseHandler.badRequest(res, i18n.__('INVALID_PAYMENT_ID'));
      }

      const paymentData: Partial<Payment> = req.body;

      if (paymentData.billing_date) {
        const billingDate = parseBillingDate(
          paymentData.billing_date as unknown as string,
        );
        if (!billingDate) {
          const source = 'updatePayment';
          systemLog.createSystemLog(
            user,
            'Invalid Billing Date Format',
            source,
          );
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
      notificationModel.createNotification(
        'updatePayment',
        i18n.__('PAYMENT_UPDATED_SUCCESSFULLY'),
        null,
        user,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'updatePayment';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('PAYMENT_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'updatePayment';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const deletePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) {
        const user = await authHandler(req, res, next);
        const source = 'deletePayment';
        systemLog.createSystemLog(user, 'Invalid Payment Id', source);
        return ResponseHandler.badRequest(res, i18n.__('INVALID_PAYMENT_ID'));
      }
      const deletedPayment = await paymentModel.deletePayment(paymentId);
      ResponseHandler.success(
        res,
        i18n.__('PAYMENT_DELETED_SUCCESSFULLY'),
        deletedPayment,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'deletePayment';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('PAYMENT_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'deletePayment';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getPaymentsByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the request headers
      const user = await authHandler(req, res, next);

      const payments = await paymentModel.getPaymentsByUser(user);
      ResponseHandler.success(
        res,
        i18n.__('PAYMENTS_RETRIEVED_SUCCESSFULLY'),
        payments,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getPaymentsByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
