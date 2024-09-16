/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
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
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const newContactUs: ContactUs = req.body;
      const createdContactUs = await contactUsModel.createContactUs(
        newContactUs,
        user,
      );

      const auditUser = await authHandler(req, res);
      const action = 'createContactUs';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('CONTACT_US_CREATED'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('CONTACT_US_CREATED'),
        createdContactUs,
      );
    } catch (error: any) {
      const source = 'createContactUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllContactUs = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const contactUs = await contactUsModel.getAllContactUs();
      return ResponseHandler.success(
        res,
        i18n.__('CONTACT_US_RETRIEVED_SUCCESSFULLY'),
        contactUs,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'getAllContactUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getOneContactUs = asyncHandler(
  async (req: Request, res: Response) => {
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
      const user = await authHandler(req, res);
      const source = 'getOneContactUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

// export const updateContactUs = asyncHandler(
//   async (req: Request, res: Response) => {
//     const auditUser = await authHandler(req, res);
//     try {
//       const contactUsId = parseInt(req.params.id, 10);
//       const contactUsData: Partial<ContactUs> = req.body;
//       const updatedContactUs = await contactUsModel.updateContactUs(
//         contactUsId,
//         contactUsData,
//       );

//       ResponseHandler.success(
//         res,
//         i18n.__('CONTACT_US_UPDATED_SUCCESSFULLY'),
//         updatedContactUs,
//       );
//       const action = 'updateContactUs';
//       auditTrail.createAuditTrail(
//         auditUser,
//         action,
//         i18n.__('CONTACT_US_UPDATED_SUCCESSFULLY'),
//       );
//     } catch (error) {
//       const user = await authHandler(req, res);
//       const source = 'updateContactUs';
//       systemLog.createSystemLog(user, (error as Error).message, source);
//       ResponseHandler.badRequest(res, (error as Error).message);
//       // next(error);
//     }
//   },
// );

export const deleteContactUs = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const contactUsId = parseInt(req.params.id, 10);
      const deletedContactUs =
        await contactUsModel.deleteContactUs(contactUsId);

      const action = 'deleteContactUs';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('CONTACT_US_UPDATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('CONTACT_US_DELETED_SUCCESSFULLY'),
        deletedContactUs,
      );
    } catch (error) {
      const source = 'deleteContactUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
