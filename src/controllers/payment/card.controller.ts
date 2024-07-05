/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import CardModel from '../../models/payment/card.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Card } from '../../types/card.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import UserModel from '../../models/users/user.model';

const cardModel = new CardModel();
const userModel = new UserModel();

export const createCard = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newCard: Card = req.body;
    const user = await userModel.getOne(newCard.user_id);
    if (!user) {
      return ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'));
    }
    const createdCard = await cardModel.createCard(newCard);
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
    const cardId = req.params.id;
    const card = await cardModel.getCardById(cardId);
    ResponseHandler.success(res, i18n.__('CARD_RETRIEVED_SUCCESSFULLY'), card);
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
  }
});

export const updateCard = asyncHandler(async (req: Request, res: Response) => {
  try {
    const cardId = req.params.id;
    const cardData: Partial<Card> = req.body;
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
    const cardId = req.params.id;
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
