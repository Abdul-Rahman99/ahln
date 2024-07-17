import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { Address } from '../../types/address.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import AddressModel from '../../models/box/address.model';

import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

const addressModel = new AddressModel();

export const createAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newAddress: Address = req.body;
      const createdAddress = await addressModel.createAddress(newAddress);

      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_CREATED_SUCCESSFULLY'),
        createdAddress,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'createAddress';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('ADDRESS_CREATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'createAddress';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getAllAddresses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addresses = await addressModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('ADDRESSES_RETRIEVED_SUCCESSFULLY'),
        addresses,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getAllAddresses';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getAddressById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = parseInt(req.params.id, 10);
      const address = await addressModel.getOne(addressId);
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_RETRIEVED_SUCCESSFULLY'),
        address,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getAddressById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const updateAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = parseInt(req.params.id, 10);
      const addressData: Partial<Address> = req.body;
      const updatedAddress = await addressModel.updateOne(
        addressData,
        addressId,
      );

      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_UPDATED_SUCCESSFULLY'),
        updatedAddress,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'updateAddress';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('ADDRESS_CREATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'updateAddress';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const deleteAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = parseInt(req.params.id, 10);
      const deletedAddress = await addressModel.deleteOne(addressId);

      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_DELETED_SUCCESSFULLY'),
        deletedAddress,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'deleteAddress';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('ADDRESS_DELETED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'deleteAddress';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);
