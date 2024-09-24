/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
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
import UserDevicesModel from '../../models/users/user.devices.model';

const userDevicesModel = new UserDevicesModel();
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
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const newPayment: Payment = req.body;
      const billingDate = parseBillingDate(
        newPayment.billing_date as unknown as string,
      );
      if (!billingDate) {
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
      const createdPayment = await paymentModel.createPayment(newPayment, user);

      notificationModel.createNotification(
        'checkOTP',
        i18n.__('OTP_VERIFIED_SUCCESSFULLY'),
        null,
        user,
        null,
      );
      const action = 'createPayment';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('PAYMENT_CREATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('PAYMENT_CREATED_SUCCESSFULLY'),
        createdPayment,
      );
    } catch (error: any) {
      const source = 'createPayment';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const payments = await paymentModel.getAllPayments();
      ResponseHandler.success(
        res,
        i18n.__('PAYMENTS_RETRIEVED_SUCCESSFULLY'),
        payments,
      );
    } catch (error: any) {
      const source = 'getAllPayments';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) {
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
      const source = 'getPaymentById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updatePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const paymentId = parseInt(req.params.id, 10);
      const user = await paymentModel.getUserByPayment(paymentId);

      if (isNaN(paymentId)) {
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
      if (updatedPayment) {
        notificationModel.createNotification(
          'updatePayment',
          i18n.__('PAYMENT_UPDATED_SUCCESSFULLY'),
          null,
          user,
          null,
        );
        const action = 'updatePayment';
        auditTrail.createAuditTrail(
          user,
          action,
          i18n.__('PAYMENT_UPDATED_SUCCESSFULLY'),
          null,
        );
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
        try {
          notificationModel.pushNotification(
            fcmToken,
            i18n.__('UPDATE_PAYMENT'),
            i18n.__('PAYMENT_SUCCESSFULLY_DONE'),
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const source = 'updatePayment';
          systemLog.createSystemLog(
            user,
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
        ResponseHandler.success(
          res,
          i18n.__('PAYMENT_UPDATED_SUCCESSFULLY'),
          updatedPayment,
        );
      }
    } catch (error: any) {
      const source = 'updatePayment';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('UPDATE_PAYMENT'),
          i18n.__('PAYMENT_UNSUCCESSFULL'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'updatePayment';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
      // next(error);
    }
  },
);

export const deletePayment = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const paymentId = parseInt(req.params.id, 10);
      if (isNaN(paymentId)) {
        const source = 'deletePayment';
        systemLog.createSystemLog(user, 'Invalid Payment Id', source);
        return ResponseHandler.badRequest(res, i18n.__('INVALID_PAYMENT_ID'));
      }
      const deletedPayment = await paymentModel.deletePayment(paymentId);

      const action = 'deletePayment';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('PAYMENT_DELETED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('PAYMENT_DELETED_SUCCESSFULLY'),
        deletedPayment,
      );
    } catch (error: any) {
      const source = 'deletePayment';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getPaymentsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const payments = await paymentModel.getPaymentsByUser(user);
      ResponseHandler.success(
        res,
        i18n.__('PAYMENTS_RETRIEVED_SUCCESSFULLY'),
        payments,
      );
    } catch (error: any) {
      const source = 'getPaymentsByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
