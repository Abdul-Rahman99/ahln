"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCard = exports.updateCard = exports.getCardById = exports.getAllCards = exports.createCard = void 0;
const card_model_1 = __importDefault(require("../../models/payment/card.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const cardModel = new card_model_1.default();
const userModel = new user_model_1.default();
const parseExpireDate = (dateString) => {
    const [month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-01`);
    return isNaN(date.getTime()) ? null : date;
};
exports.createCard = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newCard = req.body;
        const expireDate = parseExpireDate(newCard.expire_date);
        if (!expireDate) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_EXPIRE_DATE_FORMAT'));
        }
        newCard.expire_date = expireDate;
        newCard.card_number = await bcrypt_1.default.hash(newCard.card_number, 10);
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('TOKEN_NOT_PROVIDED'));
        }
        const user = await userModel.findByToken(token);
        if (!user) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_TOKEN'));
        }
        const createdCard = await cardModel.createCard(newCard, user);
        responsesHandler_1.default.success(res, i18n_1.default.__('CARD_CREATED_SUCCESSFULLY'), createdCard);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllCards = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const cards = await cardModel.getAllCards();
        responsesHandler_1.default.success(res, i18n_1.default.__('CARDS_RETRIEVED_SUCCESSFULLY'), cards);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getCardById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const cardId = parseInt(req.params.id, 10);
        if (isNaN(cardId)) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CARD_ID'));
        }
        const card = await cardModel.getCardById(cardId);
        responsesHandler_1.default.success(res, i18n_1.default.__('CARD_RETRIEVED_SUCCESSFULLY'), card);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateCard = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const cardId = parseInt(req.params.id, 10);
        if (isNaN(cardId)) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CARD_ID'));
        }
        const cardData = req.body;
        if (cardData.expire_date) {
            const expireDate = parseExpireDate(cardData.expire_date);
            if (!expireDate) {
                return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_EXPIRE_DATE_FORMAT'));
            }
            cardData.expire_date = expireDate;
        }
        if (cardData.card_number) {
            cardData.card_number = await bcrypt_1.default.hash(cardData.card_number, 10);
        }
        const updatedCard = await cardModel.updateCard(cardId, cardData);
        responsesHandler_1.default.success(res, i18n_1.default.__('CARD_UPDATED_SUCCESSFULLY'), updatedCard);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteCard = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const cardId = parseInt(req.params.id, 10);
        if (isNaN(cardId)) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CARD_ID'));
        }
        const deletedCard = await cardModel.deleteCard(cardId);
        responsesHandler_1.default.success(res, i18n_1.default.__('CARD_DELETED_SUCCESSFULLY'), deletedCard);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=card.controller.js.map