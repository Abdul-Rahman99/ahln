import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { Address } from '../../types/address.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import AddressModel from '../../models/box/address.model';

const addressModel = new AddressModel();

export const createAddress = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newAddress: Address = req.body;
      const createdAddress = await addressModel.createAddress(newAddress);
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_CREATED_SUCCESSFULLY'),
        createdAddress,
      );
    } catch (error) {
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_CREATION_FAILED'),
        (error as Error).message,
      );
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
      ResponseHandler.success(
        res,
        i18n.__('ADDRESSES_RETRIEVAL_FAILED'),
        (error as Error).message,
      );
    }
  },
);

export const getAddressById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const addressId = parseInt(req.params.id, 10);
      const address = await addressModel.getOne(addressId);
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_RETRIEVED_SUCCESSFULLY'),
        address,
      );
    } catch (error) {
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_RETRIEVAL_FAILED'),
        (error as Error).message,
      );
    }
  },
);

export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
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
    } catch (error) {
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_UPDATE_FAILED'),
        (error as Error).message,
      );
    }
  },
);

export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const addressId = parseInt(req.params.id, 10);
      const deletedAddress = await addressModel.deleteOne(addressId);
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_DELETED_SUCCESSFULLY'),
        deletedAddress,
      );
    } catch (error) {
      ResponseHandler.success(
        res,
        i18n.__('ADDRESS_DELETION_FAILED'),
        (error as Error).message,
      );
    }
  },
);
