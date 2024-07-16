/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import BoxScreenMessagesModel from '../../models/adminstration/box.screen.messages.model';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';

const boxScreenMessagesModel = new BoxScreenMessagesModel();
const systemLog = new SystemLogModel();
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
      const user = await authHandler(req, res, next);
      const source = 'boxScreenMessage';
      systemLog.createSystemLog(user, (error as Error).message, source);
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
      const user = await authHandler(req, res, next);
      const source = 'getAllBoxScreenMessages';
      systemLog.createSystemLog(user, (error as Error).message, source);
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
        const user = await authHandler(req, res, next);
        const source = 'getBoxScreenMessageById';
        systemLog.createSystemLog(user, 'Box Screen Message Not Found', source);
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
      const user = await authHandler(req, res, next);
      const source = 'getBoxScreenMessageById';
      systemLog.createSystemLog(user, (error as Error).message, source);
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
      const user = await authHandler(req, res, next);
      const source = 'updateBoxScreenMessage';
      systemLog.createSystemLog(user, (error as Error).message, source);
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
      const user = await authHandler(req, res, next);
      const source = 'deleteBoxScreenMessage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
