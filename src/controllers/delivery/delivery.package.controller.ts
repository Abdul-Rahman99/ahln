/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import DeliveryPackageModel from '../../models/delivery/delivery.package.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { DeliveryPackage } from '../../types/delivery.package.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import UserModel from '../../models/users/user.model';
import ShippingCompanyModel from '../../models/delivery/shipping.company.model';
import authHandler from '../../utils/authHandler';

import SystemLogModel from '../../models/logs/system.log.model';
const systemLog = new SystemLogModel();

const userModel = new UserModel();
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
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createDeliveryPackage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
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
      next(error);
      ResponseHandler.badRequest(res, error.message);
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
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const updateDeliveryPackage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
      );
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'),
        updatedDeliveryPackage,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'updateDeliveryPackage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const deleteDeliveryPackage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryPackageId = req.params.id;
      const deletedDeliveryPackage =
        await deliveryPackageModel.deleteOne(deliveryPackageId);
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'),
        deletedDeliveryPackage,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'deleteDeliveryPackage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

// Controller function to get all delivery packages for the current user
export const getUserDeliveryPackages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.query;
      // Extract token from the request headers
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        const user = await authHandler(req, res, next);
        const source = 'getUserDeliveryPackages';
        systemLog.createSystemLog(user, 'Token Not Provided', source);
        return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
      }

      const user = await userModel.findByToken(token);

      if (!user) {
        const user = await authHandler(req, res, next);
        const source = 'getUserDeliveryPackages';
        systemLog.createSystemLog(user, 'Token Invalid', source);
        return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
      }

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
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
