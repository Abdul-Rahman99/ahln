/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import ShippingCompanyModel from '../../models/delivery/shipping.company.model';

import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();
const shippingCompanyModel = new ShippingCompanyModel();

import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

export const createShippingCompany = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { tracking_system, title, logo } = req.body;

    try {
      const shippingCompany = await shippingCompanyModel.createShippingCompany(
        tracking_system,
        title,
        logo,
      );

      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANY_CREATED_SUCCESSFULLY'),
        shippingCompany,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'createShippingCompany';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('SHIPPING_COMPANY_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createShippingCompany';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getAllShippingCompanies = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shippingCompanies =
        await shippingCompanyModel.getAllShippingCompanies();

      return ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANIES_FETCHED_SUCCESSFULLY'),
        shippingCompanies,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getAllShippingCompanies';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getShippingCompanyById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const shippingCompany = await shippingCompanyModel.getShippingCompanyById(
        parseInt(id, 10),
      );

      if (!shippingCompany) {
        const user = await authHandler(req, res, next);
        const source = 'uploadImage';
        systemLog.createSystemLog(user, 'Shipping Company Not Found', source);
        return ResponseHandler.badRequest(
          res,
          i18n.__('SHIPPING_COMPANY_NOT_FOUND'),
        );
      }

      return ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANY_FETCHED_SUCCESSFULLY'),
        shippingCompany,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getShippingCompanyById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const updateShippingCompany = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { tracking_system } = req.body;

    try {
      const updatedShippingCompany =
        await shippingCompanyModel.updateShippingCompany(
          parseInt(id, 10),
          tracking_system,
        );

      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANY_UPDATED_SUCCESSFULLY'),
        updatedShippingCompany,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'updateShippingCompany';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('SHIPPING_COMPANY_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'updateShippingCompany';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const deleteShippingCompany = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      await shippingCompanyModel.deleteShippingCompany(parseInt(id, 10));

      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANY_DELETED_SUCCESSFULLY'),
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'deleteShippingCompany';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('SHIPPING_COMPANY_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'deleteShippingCompany';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);
