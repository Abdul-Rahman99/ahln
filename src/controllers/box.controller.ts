import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import BoxModel from '../models/box/box.model';
import Box from '../types/box.type';
import i18n from '../config/i18n';

const boxModel = new BoxModel();

export const createBox = asyncHandler(async (req: Request, res: Response) => {
  const box: Box = req.body;
  const newBox = await boxModel.create(box);
  res.status(201).json({
    message: i18n.__('BOX_CREATED_SUCCESS'),
    data: newBox,
  });
});

export const getAllBoxes = asyncHandler(async (req: Request, res: Response) => {
  const boxes = await boxModel.getMany();
  res.json(boxes);
});

export const getBoxById = asyncHandler(async (req: Request, res: Response) => {
  const boxId = req.params.id;
  const box = await boxModel.getOne(boxId);
  res.json(box);
});

export const updateBox = asyncHandler(async (req: Request, res: Response) => {
  const boxId = req.params.id;
  const boxData: Partial<Box> = req.body;
  const updatedBox = await boxModel.updateOne(boxData, boxId);
  res.json({
    message: i18n.__('BOX_UPDATED_SUCCESS'),
    data: updatedBox,
  });
});

export const deleteBox = asyncHandler(async (req: Request, res: Response) => {
  const boxId = req.params.id;
  const deletedBox = await boxModel.deleteOne(boxId);
  res.json({
    message: i18n.__('BOX_DELETED_SUCCESS'),
    data: deletedBox,
  });
});
