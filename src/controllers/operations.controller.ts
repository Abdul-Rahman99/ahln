import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import OperationsModel from '../models/operations.model';
import Operation from '../types/operations.type';
import i18n from '../config/i18n';

const operationsModel = new OperationsModel();

export const createOperaion = asyncHandler(
  async (req: Request, res: Response) => {
    const operation: Operation = req.body;
    const newOperation = await operationsModel.create(operation);
    res.status(201).json({
      message: i18n.__('OPERATION_CREATED_SUCCESS'),
      data: newOperation,
    });
  },
);
