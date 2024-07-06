"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../../controllers/payment/payment.controller");
const payment_validation_1 = require("../../validation/payment/payment.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, payment_validation_1.createPaymentValidation, payment_controller_1.createPayment);
router.get('/get-all', verifyToken_1.default, payment_controller_1.getAllPayments);
router.get('/get-one/:id', verifyToken_1.default, payment_validation_1.getPaymentByIdValidation, payment_controller_1.getPaymentById);
router.put('/update/:id', verifyToken_1.default, payment_validation_1.updatePaymentValidation, payment_controller_1.updatePayment);
router.delete('/delete/:id', verifyToken_1.default, payment_validation_1.deletePaymentValidation, payment_controller_1.deletePayment);
router.get('/get-user-payments', verifyToken_1.default, payment_controller_1.getPaymentsByUser);
exports.default = router;
//# sourceMappingURL=payment.route.js.map