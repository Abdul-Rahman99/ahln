/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import BoxScreenMessagesModel from '../../models/adminstration/box.screen.messages.model';

const boxScreenMessagesModel = new BoxScreenMessagesModel();

export const createBoxScreenMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { box_id, user_id, tablet_id, title, message } = req.body;

    try {
      const boxScreenMessage =
        await boxScreenMessagesModel.createBoxScreenMessage(
          box_id,
          user_id,
          tablet_id,
          title,
          message,
        );

      ResponseHandler.success(
        res,
        i18n.__('BOX_SCREEN_MESSAGE_CREATED_SUCCESSFULLY'),
        boxScreenMessage,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getAllBoxScreenMessages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxScreenMessages =
        await boxScreenMessagesModel.getAllBoxScreenMessages();
      ResponseHandler.success(
        res,
        i18n.__('BOX_SCREEN_MESSAGES_FETCHED_SUCCESSFULLY'),
        boxScreenMessages,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getBoxScreenMessageById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const boxScreenMessage =
        await boxScreenMessagesModel.getBoxScreenMessageById(parseInt(id, 10));

      if (!boxScreenMessage) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('BOX_SCREEN_MESSAGE_NOT_FOUND'),
        );
      }

      ResponseHandler.success(
        res,
        i18n.__('BOX_SCREEN_MESSAGE_FETCHED_SUCCESSFULLY'),
        boxScreenMessage,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const updateBoxScreenMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { box_id, user_id, tablet_id, title, message } = req.body;

    try {
      const updatedBoxScreenMessage =
        await boxScreenMessagesModel.updateBoxScreenMessage(parseInt(id, 10), {
          box_id,
          user_id,
          tablet_id,
          title,
          message,
        });

      ResponseHandler.success(
        res,
        i18n.__('BOX_SCREEN_MESSAGE_UPDATED_SUCCESSFULLY'),
        updatedBoxScreenMessage,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const deleteBoxScreenMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const deletedBoxScreenMessage =
        await boxScreenMessagesModel.deleteBoxScreenMessage(parseInt(id, 10));
      ResponseHandler.success(
        res,
        i18n.__('BOX_SCREEN_MESSAGE_DELETED_SUCCESSFULLY'),
        deletedBoxScreenMessage,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
