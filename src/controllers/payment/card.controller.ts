/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import CardModel from '../../models/payment/card.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Card } from '../../types/card.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import bcrypt from 'bcrypt';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';

const systemLog = new SystemLogModel();
const cardModel = new CardModel();
const auditTrail = new AuditTrailModel();

const parseExpireDate = (dateString: string): Date | null => {
  const [month, year] = dateString.split('-');
  const date = new Date(`${year}-${month}-01`); // Use the first day of the month as default
  return isNaN(date.getTime()) ? null : date;
};

export const createCard = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const newCard: Card = req.body;
    const expireDate = parseExpireDate(
      newCard.expire_date as unknown as string,
    );
    if (!expireDate) {
      const source = 'createCard';
      systemLog.createSystemLog(user, 'Invalid Expire Date Format', source);
      return ResponseHandler.badRequest(
        res,
        i18n.__('INVALID_EXPIRE_DATE_FORMAT'),
      );
    }
    newCard.expire_date = expireDate;

    // Hash the card number before saving
    newCard.card_number = await bcrypt.hash(newCard.card_number, 10);

    const createdCard = await cardModel.createCard(newCard, user);
    ResponseHandler.success(
      res,
      i18n.__('CARD_CREATED_SUCCESSFULLY'),
      createdCard,
    );
    const action = 'createCard';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('CARD_CREATED_SUCCESSFULLY'),
      null,
    );
  } catch (error: any) {
    const source = 'createCard';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const getAllCards = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const cards = await cardModel.getAllCards();
    ResponseHandler.success(
      res,
      i18n.__('CARDS_RETRIEVED_SUCCESSFULLY'),
      cards,
    );
  } catch (error: any) {
    const source = 'getAllCards';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const getCardById = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const cardId = parseInt(req.params.id, 10);
    if (isNaN(cardId)) {
      const source = 'getCardById';
      systemLog.createSystemLog(user, 'Invalid Card Id', source);
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CARD_ID'));
    }
    const card = await cardModel.getCardById(cardId);
    ResponseHandler.success(res, i18n.__('CARD_RETRIEVED_SUCCESSFULLY'), card);
  } catch (error: any) {
    const source = 'getCardById';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const updateCard = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const cardId = parseInt(req.params.id, 10);
    if (isNaN(cardId)) {
      const source = 'updateCard';
      systemLog.createSystemLog(user, 'Invalid Card Id', source);
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CARD_ID'));
    }

    const cardData: Partial<Card> = req.body;

    if (cardData.expire_date) {
      const expireDate = parseExpireDate(
        cardData.expire_date as unknown as string,
      );
      if (!expireDate) {
        const source = 'updateById';
        systemLog.createSystemLog(user, 'Invalid Expire Date Format', source);
        return ResponseHandler.badRequest(
          res,
          i18n.__('INVALID_EXPIRE_DATE_FORMAT'),
        );
      }
      cardData.expire_date = expireDate;
    }

    if (cardData.card_number) {
      // Hash the card number before updating
      cardData.card_number = await bcrypt.hash(cardData.card_number, 10);
    }

    const updatedCard = await cardModel.updateCard(cardId, cardData, user);
    ResponseHandler.success(
      res,
      i18n.__('CARD_UPDATED_SUCCESSFULLY'),
      updatedCard,
    );
    const action = 'updateCard';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('CARD_UPDATED_SUCCESSFULLY'),
      null,
    );
  } catch (error: any) {
    const source = 'updateCard';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const deleteCard = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const cardId = parseInt(req.params.id, 10);
    if (isNaN(cardId)) {
      const source = 'deleteCard';
      systemLog.createSystemLog(user, 'Invalid Card Id', source);
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CARD_ID'));
    }
    const deletedCard = await cardModel.deleteCard(cardId);
    ResponseHandler.success(
      res,
      i18n.__('CARD_DELETED_SUCCESSFULLY'),
      deletedCard,
    );
    const action = 'deleteCard';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('CARD_DELETED_SUCCESSFULLY'),
      null,
    );
  } catch (error: any) {
    const source = 'deleteCard';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});
