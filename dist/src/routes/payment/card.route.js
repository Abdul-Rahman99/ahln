"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const card_controller_1 = require("../../controllers/payment/card.controller");
const card_validation_1 = require("../../validation/payment/card.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, card_validation_1.createCardValidation, card_controller_1.createCard);
router.get('/get-all', verifyToken_1.default, card_controller_1.getAllCards);
router.get('/get-one/:id', verifyToken_1.default, card_validation_1.getCardByIdValidation, card_controller_1.getCardById);
router.put('/update/:id', verifyToken_1.default, card_validation_1.updateCardValidation, card_controller_1.updateCard);
router.delete('/delete/:id', verifyToken_1.default, card_validation_1.deleteCardValidation, card_controller_1.deleteCard);
exports.default = router;
//# sourceMappingURL=card.route.js.map