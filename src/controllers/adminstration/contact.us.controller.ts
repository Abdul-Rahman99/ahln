/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import ContactUsModel from '../../models/adminstration/contact.us.model';
import { ContactUs } from '../../types/contact.us.type';
import authHandler from '../../utils/authHandler';
import SystemLogModel from '../../models/logs/system.log.model';
const systemLog = new SystemLogModel();
const contactUsModel = new ContactUsModel();
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

export const createContactUs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newContactUs: ContactUs = req.body;

      const user = await authHandler(req, res, next);

      const createdContactUs = await contactUsModel.createContactUs(
        newContactUs,
        user,
      );

      ResponseHandler.success(
        res,
        i18n.__('CONTACT_US_CREATED'),
        createdContactUs,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'createContactUs';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('CONTACT_US_CREATED'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createContactUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const getAllContactUs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactUs = await contactUsModel.getAllContactUs();
      return ResponseHandler.success(
        res,
        i18n.__('CONTACT_US_RETRIEVED_SUCCESSFULLY'),
        contactUs,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getAllContactUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const getOneContactUs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactUsId = parseInt(req.params.id, 10);
      const contactUs = await contactUsModel.getContactUsById(
        Number(contactUsId),
      );
      return ResponseHandler.success(
        res,
        i18n.__('CONTACT_US_RETRIEVED_SUCCESSFULLY'),
        contactUs,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getOneContactUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const updateContactUs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactUsId = parseInt(req.params.id, 10);
      const contactUsData: Partial<ContactUs> = req.body;
      const updatedContactUs = await contactUsModel.updateContactUs(
        contactUsId,
        contactUsData,
      );

      ResponseHandler.success(
        res,
        i18n.__('CONTACT_US_UPDATED_SUCCESSFULLY'),
        updatedContactUs,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'updateContactUs';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('CONTACT_US_UPDATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'updateContactUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      next(error);
    }
  },
);

export const deleteContactUs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const contactUsId = parseInt(req.params.id, 10);
      const deletedContactUs =
        await contactUsModel.deleteContactUs(contactUsId);

      ResponseHandler.success(
        res,
        i18n.__('CONTACT_US_DELETED_SUCCESSFULLY'),
        deletedContactUs,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'deleteContactUs';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('CONTACT_US_UPDATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'deleteContactUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      next(error);
    }
  },
);
