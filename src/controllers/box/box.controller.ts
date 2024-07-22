import { Request, Response, NextFunction } from 'express';
import BoxModel from '../../models/box/box.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Box } from '../../types/box.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';

import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

const systemLog = new SystemLogModel();
const boxModel = new BoxModel();

export const createBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newBox: Box = req.body;

      const boxExist = await boxModel.boxExists(newBox.serial_number);
      if (boxExist) {
        const user = await authHandler(req, res, next);
        const source = 'createBox';
        systemLog.createSystemLog(user, i18n.__('BOX_ALREADY_EXISTS'), source);
        return ResponseHandler.badRequest(res, i18n.__('BOX_ALREADY_EXISTS'));
      }

      const createdBox = await boxModel.createBox(newBox);
      ResponseHandler.success(
        res,
        i18n.__('BOX_CREATED_SUCCESSFULLY'),
        createdBox,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'createBox';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('BOX_CREATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'createBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getAllBoxes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxes = await boxModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('BOXES_RETRIEVED_SUCCESSFULLY'),
        boxes,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getAllBoxes';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getBoxById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxId = req.params.id;
      const box = await boxModel.getOne(boxId);
      ResponseHandler.success(res, i18n.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getBoxById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const updateBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxId = req.params.id;
      const boxData: Partial<Box> = req.body;
      const updatedBox = await boxModel.updateOne(boxData, boxId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_UPDATED_SUCCESSFULLY'),
        updatedBox,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'updateBox';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('BOX_UPDATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'updateBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const deleteBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxId = req.params.id;
      const deletedBox = await boxModel.deleteOne(boxId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_DELETED_SUCCESSFULLY'),
        deletedBox,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'deleteBox';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('BOX_DELETED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'deleteBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getBoxesByGenerationId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxGenerationId = req.params.generationId;
      const boxes = await boxModel.getBoxesByGenerationId(boxGenerationId);

      ResponseHandler.success(
        res,
        i18n.__('BOXES_RETRIEVED_SUCCESSFULLY'),
        boxes,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getBoxesByGenerationId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getBoxByTabletInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { androidTabletId, tabletSerialNumber } = req.body;
      const box = await boxModel.getBoxByTabletInfo(
        androidTabletId,
        tabletSerialNumber,
      );
      ResponseHandler.success(res, i18n.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getBoxByTabletInfo';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const assignTabletToBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tabletId, boxId } = req.body;
      const assignTabletToBox = await boxModel.assignTabletToBox(
        tabletId,
        boxId,
      );
      ResponseHandler.success(
        res,
        i18n.__('TABLET_ASSIGNED_TO_BOX_SUCCESSFULLY'),
        assignTabletToBox,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'assignTabletToBox';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('TABLET_ASSIGNED_TO_BOX_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'assignTabletToBox';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const resetTabletId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tabletId, boxId } = req.body;
      const assignTabletToBox = await boxModel.resetTabletId(tabletId, boxId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_RESET_TO_BOX_SUCCESSFULLY'),
        assignTabletToBox,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'resetTabletId';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('TABLET_RESET_TO_BOX_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'resetTabletId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
