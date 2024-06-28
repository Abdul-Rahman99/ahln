/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import DeliveryPackageModel from '../../models/delivery/delivery.package.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { DeliveryPackage } from '../../types/delivery.package.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

const deliveryPackageModel = new DeliveryPackageModel();

export const createDeliveryPackage = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newDeliveryPackage: DeliveryPackage = req.body;
      const createdDeliveryPackage = await deliveryPackageModel.createDeliveryPackage(
        newDeliveryPackage
      );
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'),
        createdDeliveryPackage
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('DELIVERY_PACKAGE_CREATION_FAILED'),
        error.message
      );
    }
  }
);

export const getAllDeliveryPackages = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const deliveryPackages = await deliveryPackageModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGES_RETRIEVED_SUCCESSFULLY'),
        deliveryPackages
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('DELIVERY_PACKAGES_RETRIEVAL_FAILED'),
        error.message
      );
    }
  }
);

export const getDeliveryPackageById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const deliveryPackageId = req.params.id;
      const deliveryPackage = await deliveryPackageModel.getOne(
        deliveryPackageId
      );
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_RETRIEVED_SUCCESSFULLY'),
        deliveryPackage
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('DELIVERY_PACKAGE_RETRIEVAL_FAILED'),
        error.message
      );
    }
  }
);

export const updateDeliveryPackage = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const deliveryPackageId = req.params.id;
      const deliveryPackageData: Partial<DeliveryPackage> = req.body;
      const updatedDeliveryPackage = await deliveryPackageModel.updateOne(
        deliveryPackageData,
        deliveryPackageId
      );
      ResponseHandler.success(
        res,
        i18n.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'),
        updatedDeliveryPackage
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('DELIVERY_PACKAGE_UPDATE_FAILED'),
        error.message
      );
    }
  }
);

export const deleteDeliveryPackage = asyncHandler(
  async (req: Request, res: Response) => {
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
      ResponseHandler.internalError(
        res,
        i18n.__('DELIVERY_PACKAGE_DELETION_FAILED'),
        error.message,
      );
    }
  },
);
