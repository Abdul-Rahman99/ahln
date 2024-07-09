import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

import AuditTrailModel from '../../models/logs/audit.trail.model';

const auditTrailModel = new AuditTrailModel();

export const getAllAuditTrail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auditTrails = await auditTrailModel.getAllAuditTrail();
      ResponseHandler.success(
        res,
        i18n.__('AUDIT_TRAILS_RETRIEVED_SUCCESSFULLY'),
        auditTrails,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getAuditTrailById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auditTrailId = parseInt(req.params.id, 10);
      const auditTrail = await auditTrailModel.getAuditTrailById(auditTrailId);
      ResponseHandler.success(
        res,
        i18n.__('AUDIT_TRAIL_RETRIEVED_SUCCESSFULLY'),
        auditTrail,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const deleteAuditTrailById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auditTrailId = parseInt(req.params.id, 10);
      const auditTrail = await auditTrailModel.deleteAuditTrail(auditTrailId);
      ResponseHandler.success(
        res,
        i18n.__('AUDIT_TRAIL_DELETED_SUCCESSFULLY'),
        auditTrail,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);
