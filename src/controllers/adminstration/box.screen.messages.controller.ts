/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import BoxScreenMessagesModel from '../../models/adminstration/box.screen.messages.model';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';

import AuditTrailModel from '../../models/logs/audit.trail.model';
import BoxModel from '../../models/box/box.model';

const auditTrail = new AuditTrailModel();
const boxModel = new BoxModel();

const boxScreenMessagesModel = new BoxScreenMessagesModel();
const systemLog = new SystemLogModel();
export const createBoxScreenMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { box_id, title, message } = req.body;
    const user = await authHandler(req, res);

    try {
      const boxUserExist = await boxModel.getOneByUser(user, box_id);
      if (!boxUserExist) {
        const source = 'boxScreenMessage';
        systemLog.createSystemLog(
          user,
          i18n.__('BOX_NOT_ASSIGNED_TO_USER'),
          source,
        );
        ResponseHandler.badRequest(res, i18n.__('BOX_NOT_ASSIGNED_TO_USER'));
      }
      const tablet = await boxModel.getTabletIdByBoxId(box_id);

      const boxScreenMessage =
        await boxScreenMessagesModel.createBoxScreenMessage(
          box_id,
          user,
          Number(tablet),
          title,
          message,
        );

      ResponseHandler.success(
        res,
        i18n.__('BOX_SCREEN_MESSAGE_CREATED_SUCCESSFULLY'),
        boxScreenMessage,
      );
      const auditUser = await authHandler(req, res);
      const action = 'createBoxScreenMessage';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('BOX_SCREEN_MESSAGE_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'boxScreenMessage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllBoxScreenMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const boxScreenMessages =
        await boxScreenMessagesModel.getAllBoxScreenMessages(user);
      ResponseHandler.success(
        res,
        i18n.__('BOX_SCREEN_MESSAGES_FETCHED_SUCCESSFULLY'),
        boxScreenMessages,
      );
    } catch (error: any) {
      const source = 'getAllBoxScreenMessages';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getBoxScreenMessageById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await authHandler(req, res);

    try {
      const boxScreenMessage =
        await boxScreenMessagesModel.getBoxScreenMessageById(
          parseInt(id, 10),
          user,
        );

      if (!boxScreenMessage) {
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
      const source = 'getBoxScreenMessageById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateBoxScreenMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { box_id, tablet_id, title, message } = req.body;
    const user = await authHandler(req, res);
    try {
      const updatedBoxScreenMessage =
        await boxScreenMessagesModel.updateBoxScreenMessage(
          parseInt(id, 10),

          {
            box_id,
            user_id: user,
            tablet_id,
            title,
            message,
          },
        );

      ResponseHandler.success(
        res,
        i18n.__('BOX_SCREEN_MESSAGE_UPDATED_SUCCESSFULLY'),
        updatedBoxScreenMessage,
      );
      const auditUser = await authHandler(req, res);
      const action = 'updateBoxScreenMessage';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('BOX_SCREEN_MESSAGE_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'updateBoxScreenMessage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteBoxScreenMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await authHandler(req, res);

    try {
      const deletedBoxScreenMessage =
        await boxScreenMessagesModel.deleteBoxScreenMessage(
          parseInt(id, 10),
          user,
        );

      ResponseHandler.success(
        res,
        i18n.__('BOX_SCREEN_MESSAGE_DELETED_SUCCESSFULLY'),
        deletedBoxScreenMessage,
      );
      const action = 'deleteBoxScreenMessage';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_SCREEN_MESSAGE_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'deleteBoxScreenMessage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
