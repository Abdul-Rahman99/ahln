/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import ShippingCompanyModel from '../../models/delivery/shipping.company.model';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import { ShippingCompany } from '../../types/shipping.company.type';

const systemLog = new SystemLogModel();
const shippingCompanyModel = new ShippingCompanyModel();
const auditTrail = new AuditTrailModel();

export const createShippingCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    const { tracking_system, title, logo } = req.body;

    try {
      const shippingCompany = await shippingCompanyModel.createShippingCompany(
        tracking_system,
        title,
        logo,
      );

      const action = 'createShippingCompany';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('SHIPPING_COMPANY_CREATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANY_CREATED_SUCCESSFULLY'),
        shippingCompany,
      );
    } catch (error: any) {
      const source = 'createShippingCompany';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllShippingCompanies = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const shippingCompanies =
        await shippingCompanyModel.getAllShippingCompanies();

      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANIES_FETCHED_SUCCESSFULLY'),
        shippingCompanies,
      );
    } catch (error: any) {
      const source = 'getAllShippingCompanies';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getShippingCompanyById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await authHandler(req, res);

    try {
      const shippingCompany = await shippingCompanyModel.getShippingCompanyById(
        parseInt(id, 10),
      );

      if (!shippingCompany) {
        const source = 'uploadImage';
        systemLog.createSystemLog(user, 'Shipping Company Not Found', source);
        return ResponseHandler.badRequest(
          res,
          i18n.__('SHIPPING_COMPANY_NOT_FOUND'),
        );
      }

      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANY_FETCHED_SUCCESSFULLY'),
        shippingCompany,
      );
    } catch (error: any) {
      const source = 'getShippingCompanyById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateShippingCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    const { id } = req.params;
    const shippingCompanyData: Partial<ShippingCompany> = req.body;
    try {
      const updatedShippingCompany =
        await shippingCompanyModel.updateShippingCompany(
          shippingCompanyData,
          parseInt(id),
        );

      const action = 'updateShippingCompany';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('SHIPPING_COMPANY_UPDATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANY_UPDATED_SUCCESSFULLY'),
        updatedShippingCompany,
      );
    } catch (error: any) {
      const source = 'updateShippingCompany';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteShippingCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await authHandler(req, res);

    try {
      await shippingCompanyModel.deleteShippingCompany(parseInt(id, 10));

      const action = 'deleteShippingCompany';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('SHIPPING_COMPANY_DELETED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANY_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'deleteShippingCompany';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
