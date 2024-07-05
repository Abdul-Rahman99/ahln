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
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const cardModel = new card_model_1.default();
const userModel = new user_model_1.default();
exports.createCard = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const newCard = req.body;
        const user = await userModel.getOne(newCard.user_id);
        if (!user) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_NOT_FOUND'));
        }
        const createdCard = await cardModel.createCard(newCard);
        responsesHandler_1.default.success(res, i18n_1.default.__('CARD_CREATED_SUCCESSFULLY'), createdCard);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllCards = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const cards = await cardModel.getAllCards();
        responsesHandler_1.default.success(res, i18n_1.default.__('CARDS_RETRIEVED_SUCCESSFULLY'), cards);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getCardById = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const cardId = req.params.id;
        const card = await cardModel.getCardById(cardId);
        responsesHandler_1.default.success(res, i18n_1.default.__('CARD_RETRIEVED_SUCCESSFULLY'), card);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateCard = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const cardId = req.params.id;
        const cardData = req.body;
        const updatedCard = await cardModel.updateCard(cardId, cardData);
        responsesHandler_1.default.success(res, i18n_1.default.__('CARD_UPDATED_SUCCESSFULLY'), updatedCard);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteCard = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const cardId = req.params.id;
        const deletedCard = await cardModel.deleteCard(cardId);
        responsesHandler_1.default.success(res, i18n_1.default.__('CARD_DELETED_SUCCESSFULLY'), deletedCard);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=card.controller.js.map