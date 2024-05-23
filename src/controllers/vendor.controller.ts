import { Request, Response } from 'express';
import VendorModel from '../models/vendor.model';
import asyncHandler from '../middlewares/asyncHandler';
import Vendor from '../types/vendor.type';
import i18n from '../config/i18n';

const vendorModel = new VendorModel();

export const createVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const newVendor: Vendor = req.body;
    const createdVendor = await vendorModel.create(newVendor);
    res.status(201).json({
      message: i18n.__('VENDOR_CREATED_SUCCESSFULLY'),
      data: createdVendor,
    });
  },
);

export const getAllVendors = asyncHandler(
  async (req: Request, res: Response) => {
    const vendors = await vendorModel.getMany();
    res.json(vendors);
  },
);

export const getVendorById = asyncHandler(
  async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const vendor = await vendorModel.getOne(vendorId as any);
    res.json(vendor);
  },
);

export const updateVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const vendorData: Partial<Vendor> = req.body;
    const updatedVendor = await vendorModel.updateOne(
      vendorData,
      vendorId as any,
    );
    res.json({
      message: i18n.__('VENDOR_UPDATED_SUCCESSFULLY'),
      updatedVendor,
    });
  },
);

export const deleteVendor = asyncHandler(
  async (req: Request, res: Response) => {
    const vendorId = req.params.id;
    const deletedVendor = await vendorModel.deleteOne(vendorId as any);
    res.json({
      message: i18n.__('VENDOR_DELETED_SUCCESSFULLY'),
      deletedVendor,
    });
  },
);
