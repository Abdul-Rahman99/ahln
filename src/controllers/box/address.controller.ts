import { Request, Response } from 'express';
import { Address } from '../../types/address.type';
import i18n from '../../config/i18n';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import AddressModel from '../../models/box/address.model';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';

const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const addressModel = new AddressModel();

export const createAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const newAddress: Address = req.body;
      const createdAddress = await addressModel.createAddress(newAddress, user);

      const action = 'createAddress';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('ADDRESS_CREATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_CREATED_SUCCESSFULLY'),
        createdAddress,
      );
    } catch (error) {
      const source = 'createAddress';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getAllAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const addresses = await addressModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('ADDRESSES_RETRIEVED_SUCCESSFULLY'),
        addresses,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'getAllAddresses';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getAddressById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const addressId = parseInt(req.params.id, 10);
      const address = await addressModel.getOne(addressId, user);
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_RETRIEVED_SUCCESSFULLY'),
        address,
      );
    } catch (error) {
      const source = 'getAddressById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const addressId = parseInt(req.params.id, 10);
      const addressData: Partial<Address> = req.body;
      const updatedAddress = await addressModel.updateOne(
        addressData,
        addressId,
        user,
      );

      const action = 'updateAddress';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('ADDRESS_CREATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_UPDATED_SUCCESSFULLY'),
        updatedAddress,
      );
    } catch (error) {
      const source = 'updateAddress';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const addressId = parseInt(req.params.id, 10);
      const deletedAddress = await addressModel.deleteOne(addressId, user);

      const action = 'deleteAddress';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('ADDRESS_DELETED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_DELETED_SUCCESSFULLY'),
        deletedAddress,
      );
    } catch (error) {
      const source = 'deleteAddress';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
