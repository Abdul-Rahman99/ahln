/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import CityModel from '../../models/adminstration/city.model';
import { City } from '../../types/city.type';
import authHandler from '../../utils/authHandler';
import SystemLogModel from '../../models/logs/system.log.model';
const systemLog = new SystemLogModel();
const cityModel = new CityModel();
import AuditTrailModel from '../../models/logs/audit.trail.model';
import CountryModel from '../../models/adminstration/country.model';

const auditTrail = new AuditTrailModel();
const countryModel = new CountryModel();

export const createCity = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }

  try {
    const newCity: City = req.body;

    const cityExists = await cityModel.checkIfCityExists(newCity.name);
    if (cityExists) {
      const source = 'createCity';
      systemLog.createSystemLog(user, 'City Already Exists', source);
      return ResponseHandler.badRequest(res, i18n.__('CITY_ALREADY_EXISTS'));
    }

    const countryExists = await countryModel.getOne(newCity.country);
    if (!countryExists) {
      const source = 'createCity';
      systemLog.createSystemLog(user, 'Country Not Found', source);
      return ResponseHandler.badRequest(res, i18n.__('COUNTRY_NOT_FOUND'));
    }

    const createdCity = await cityModel.createCity(newCity);

    const auditUser = await authHandler(req, res);
    const action = 'createCity';
    auditTrail.createAuditTrail(
      auditUser,
      action,
      i18n.__('CITY_CREATED'),
      null,
    );
    ResponseHandler.success(res, i18n.__('CITY_CREATED'), createdCity);
  } catch (error: any) {
    const source = 'createCity';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const getAllCity = asyncHandler(async (req: Request, res: Response) => {
  try {
    const city = await cityModel.getAllCity();
    return ResponseHandler.success(
      res,
      i18n.__('CITY_RETRIEVED_SUCCESSFULLY'),
      city,
    );
  } catch (error: any) {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    const source = 'getAllCity';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const getOneCity = asyncHandler(async (req: Request, res: Response) => {
  try {
    const cityId = parseInt(req.params.id, 10);
    const city = await cityModel.getCityById(Number(cityId));
    return ResponseHandler.success(
      res,
      i18n.__('CITY_RETRIEVED_SUCCESSFULLY'),
      city,
    );
  } catch (error: any) {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    const source = 'getOneCity';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const updateCity = asyncHandler(async (req: Request, res: Response) => {
  const auditUser = await authHandler(req, res);
  try {
    const cityId = parseInt(req.params.id, 10);
    const cityData: Partial<City> = req.body;
    const updatedCity = await cityModel.updateCity(cityId, cityData);

    const action = 'updateCity';
    auditTrail.createAuditTrail(
      auditUser,
      action,
      i18n.__('CITY_UPDATED_SUCCESSFULLY'),
      null,
    );
    ResponseHandler.success(
      res,
      i18n.__('CITY_UPDATED_SUCCESSFULLY'),
      updatedCity,
    );
  } catch (error) {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    const source = 'updateCity';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
    // next(error);
  }
});

export const deleteCity = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }

  try {
    const cityId = parseInt(req.params.id, 10);
    const deletedCity = await cityModel.deleteCity(cityId);

    const action = 'deleteCity';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('CITY_UPDATED_SUCCESSFULLY'),
      null,
    );
    ResponseHandler.success(
      res,
      i18n.__('CITY_DELETED_SUCCESSFULLY'),
      deletedCity,
    );
  } catch (error) {
    const source = 'deleteCity';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
    // next(error);
  }
});

export const getCityByCountry = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const countryId = parseInt(req.params.id, 10);
      const countryExists = await countryModel.getOne(countryId);
      if (!countryExists) {
        const source = 'createCity';
        systemLog.createSystemLog(user, 'Country Not Found', source);
        return ResponseHandler.badRequest(res, i18n.__('COUNTRY_NOT_FOUND'));
      }
      const city = await cityModel.getCitiesByCountryId(countryId);
      return ResponseHandler.success(
        res,
        i18n.__('CITY_RETRIEVED_SUCCESSFULLY'),
        city,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      if (user === '0') {
        return user;
      }
      const source = 'getCityByCountry';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
