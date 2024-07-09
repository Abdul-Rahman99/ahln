/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import ContactUsModel from '../../models/adminstration/contact.us.model';
import { ContactUs } from '../../types/contact.us.type';
import UserModel from '../../models/users/user.model';

const userModel = new UserModel();
const contactUsModel = new ContactUsModel();

export const createContactUs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newContactUs: ContactUs = req.body;

      // Extract token from the request headers
      let token = '';
      if (req.headers.authorization?.replace('Bearer ', '')) {
        token = req.headers.authorization?.replace('Bearer ', '');
      }

      //   if (!token) {
      //     return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
      //   }
      // Find the user by the token
      let user: any = '';
      if (token != '') {
        user = await userModel.findByToken(token);
        if (!user) {
          return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
        }
      } else {
        user = null;
      }

      const createdContactUs = await contactUsModel.createContactUs(
        newContactUs,
        user,
      );
      ResponseHandler.success(
        res,
        i18n.__('CONTACT_US_CREATED'),
        createdContactUs,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
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
      next(error);
      ResponseHandler.badRequest(res, error.message);
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
      next(error);
      ResponseHandler.badRequest(res, error.message);
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
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
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
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);
