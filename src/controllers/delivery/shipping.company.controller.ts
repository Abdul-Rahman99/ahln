/* eslint-disable @typescript-eslint/no-explicit-any */
// shippingCompany.controller.ts

import { Request, Response } from 'express';

import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import ShippingCompanyModel from '../../models/delivery/shipping.company.model';

const shippingCompanyModel = new ShippingCompanyModel();

export const createShippingCompany = asyncHandler(
  async (req: Request, res: Response) => {
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
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('SHIPPING_COMPANY_CREATION_FAILED'),
        error.message,
      );
    }
  },
);

export const getAllShippingCompanies = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const shippingCompanies =
        await shippingCompanyModel.getAllShippingCompanies();
      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANIES_FETCHED_SUCCESSFULLY'),
        shippingCompanies,
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('SHIPPING_COMPANIES_FETCH_FAILED'),
        error.message,
      );
    }
  },
);

export const getShippingCompanyById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const shippingCompany = await shippingCompanyModel.getShippingCompanyById(
        parseInt(id, 10),
      );

      if (!shippingCompany) {
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
      ResponseHandler.internalError(
        res,
        i18n.__('SHIPPING_COMPANY_FETCH_FAILED'),
        error.message,
      );
    }
  },
);

export const updateShippingCompany = asyncHandler(
  async (req: Request, res: Response) => {
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
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('SHIPPING_COMPANY_UPDATE_FAILED'),
        error.message,
      );
    }
  },
);

export const deleteShippingCompany = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await shippingCompanyModel.deleteShippingCompany(parseInt(id, 10));
      ResponseHandler.success(
        res,
        i18n.__('SHIPPING_COMPANY_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('SHIPPING_COMPANY_DELETE_FAILED'),
        error.message,
      );
    }
  },
);
