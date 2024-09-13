/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import CountryModel from '../../models/adminstration/country.model';
import { Country } from '../../types/country.type';
import authHandler from '../../utils/authHandler';
import SystemLogModel from '../../models/logs/system.log.model';
const systemLog = new SystemLogModel();
const countryModel = new CountryModel();
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

export const createCountry = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const newCountry: Country = req.body;

      const countryExists = await countryModel.checkIfCountryExists(
        newCountry.name,
      );
      if (countryExists) {
        const source = 'createCountry';
        systemLog.createSystemLog(user, 'Country Already Exists', source);
        return ResponseHandler.badRequest(
          res,
          i18n.__('COUNTRY_ALREADY_EXISTS'),
        );
      }

      const createdCountry = await countryModel.createCountry(newCountry);

      ResponseHandler.success(res, i18n.__('COUNTRY_CREATED'), createdCountry);
      const auditUser = await authHandler(req, res);
      const action = 'createCountry';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('COUNTRY_CREATED'),
        null,
      );
    } catch (error: any) {
      const source = 'createCountry';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllCountry = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const country = await countryModel.getAllCountry();
      return ResponseHandler.success(
        res,
        i18n.__('COUNTRY_RETRIEVED_SUCCESSFULLY'),
        country,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'getAllCountry';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getOneCountry = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const countryId = parseInt(req.params.id, 10);
      const country = await countryModel.getCountryCites(Number(countryId));
      return ResponseHandler.success(
        res,
        i18n.__('COUNTRY_RETRIEVED_SUCCESSFULLY'),
        country,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'getOneCountry';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateCountry = asyncHandler(
  async (req: Request, res: Response) => {
    const auditUser = await authHandler(req, res);
    try {
      const countryId = parseInt(req.params.id, 10);
      const countryData: Partial<Country> = req.body;
      const updatedCountry = await countryModel.updateCountry(
        countryId,
        countryData,
      );

      ResponseHandler.success(
        res,
        i18n.__('COUNTRY_UPDATED_SUCCESSFULLY'),
        updatedCountry,
      );
      const action = 'updateCountry';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('COUNTRY_UPDATED_SUCCESSFULLY'),
        null,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'updateCountry';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const deleteCountry = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const countryId = parseInt(req.params.id, 10);
      const deletedCountry = await countryModel.deleteCountry(countryId);

      ResponseHandler.success(
        res,
        i18n.__('COUNTRY_DELETED_SUCCESSFULLY'),
        deletedCountry,
      );
      const action = 'deleteCountry';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('COUNTRY_UPDATED_SUCCESSFULLY'),
        null,
      );
    } catch (error) {
      const source = 'deleteCountry';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
