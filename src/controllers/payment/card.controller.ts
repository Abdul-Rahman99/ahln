/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import CardModel from '../../models/payment/card.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Card } from '../../types/card.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import bcrypt from 'bcrypt';
import UserModel from '../../models/users/user.model';

const cardModel = new CardModel();
const userModel = new UserModel();

const parseExpireDate = (dateString: string): Date | null => {
  const [month, year] = dateString.split('-');
  const date = new Date(`${year}-${month}-01`); // Use the first day of the month
  return isNaN(date.getTime()) ? null : date;
};

export const createCard = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newCard: Card = req.body;
    const expireDate = parseExpireDate(
      newCard.expire_date as unknown as string,
    );
    if (!expireDate) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('INVALID_EXPIRE_DATE_FORMAT'),
      );
    }
    newCard.expire_date = expireDate;

    // Hash the card number before saving
    newCard.card_number = await bcrypt.hash(newCard.card_number, 10);
    // Extract token from the request headers
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
    }

    const user = await userModel.findByToken(token);

    if (!user) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
    }
    const createdCard = await cardModel.createCard(newCard, user);
    ResponseHandler.success(
      res,
      i18n.__('CARD_CREATED_SUCCESSFULLY'),
      createdCard,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
  }
});

export const getAllCards = asyncHandler(async (req: Request, res: Response) => {
  try {
    const cards = await cardModel.getAllCards();
    ResponseHandler.success(
      res,
      i18n.__('CARDS_RETRIEVED_SUCCESSFULLY'),
      cards,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
  }
});

export const getCardById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const cardId = parseInt(req.params.id, 10);
    if (isNaN(cardId)) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CARD_ID'));
    }
    const card = await cardModel.getCardById(cardId);
    ResponseHandler.success(res, i18n.__('CARD_RETRIEVED_SUCCESSFULLY'), card);
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
  }
});

export const updateCard = asyncHandler(async (req: Request, res: Response) => {
  try {
    const cardId = parseInt(req.params.id, 10);
    if (isNaN(cardId)) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CARD_ID'));
    }

    const cardData: Partial<Card> = req.body;

    if (cardData.expire_date) {
      const expireDate = parseExpireDate(
        cardData.expire_date as unknown as string,
      );
      if (!expireDate) {
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

    const updatedCard = await cardModel.updateCard(cardId, cardData);
    ResponseHandler.success(
      res,
      i18n.__('CARD_UPDATED_SUCCESSFULLY'),
      updatedCard,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
  }
});

export const deleteCard = asyncHandler(async (req: Request, res: Response) => {
  try {
    const cardId = parseInt(req.params.id, 10);
    if (isNaN(cardId)) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CARD_ID'));
    }
    const deletedCard = await cardModel.deleteCard(cardId);
    ResponseHandler.success(
      res,
      i18n.__('CARD_DELETED_SUCCESSFULLY'),
      deletedCard,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
  }
});
