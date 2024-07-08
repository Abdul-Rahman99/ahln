"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsByUser = exports.deletePayment = exports.updatePayment = exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const payment_model_1 = __importDefault(require("../../models/payment/payment.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const card_model_1 = __importDefault(require("../../models/payment/card.model"));
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const cardModel = new card_model_1.default();
const paymentModel = new payment_model_1.default();
const userModel = new user_model_1.default();
const parseBillingDate = (dateString) => {
    const [month, day, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? null : date;
};
exports.createPayment = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newPayment = req.body;
        const billingDate = parseBillingDate(newPayment.billing_date);
        if (!billingDate) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_BILLING_DATE_FORMAT'));
        }
        newPayment.billing_date = billingDate;
        const card = await cardModel.getCardById(newPayment.card_id);
        if (!card) {
            throw new Error(`No Card Found, please add a card`);
        }
        const createdPayment = await paymentModel.createPayment(newPayment);
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENT_CREATED_SUCCESSFULLY'), createdPayment);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getAllPayments = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const payments = await paymentModel.getAllPayments();
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENTS_RETRIEVED_SUCCESSFULLY'), payments);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getPaymentById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const paymentId = parseInt(req.params.id, 10);
        if (isNaN(paymentId)) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_PAYMENT_ID'));
        }
        const payment = await paymentModel.getPaymentById(paymentId);
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENT_RETRIEVED_SUCCESSFULLY'), payment);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.updatePayment = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const paymentId = parseInt(req.params.id, 10);
        if (isNaN(paymentId)) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_PAYMENT_ID'));
        }
        const paymentData = req.body;
        if (paymentData.billing_date) {
            const billingDate = parseBillingDate(paymentData.billing_date);
            if (!billingDate) {
                return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_BILLING_DATE_FORMAT'));
            }
            paymentData.billing_date = billingDate;
        }
        const updatedPayment = await paymentModel.updatePayment(paymentId, paymentData);
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENT_UPDATED_SUCCESSFULLY'), updatedPayment);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.deletePayment = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const paymentId = parseInt(req.params.id, 10);
        if (isNaN(paymentId)) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_PAYMENT_ID'));
        }
        const deletedPayment = await paymentModel.deletePayment(paymentId);
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENT_DELETED_SUCCESSFULLY'), deletedPayment);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getPaymentsByUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('TOKEN_NOT_PROVIDED'));
        }
        const user = await userModel.findByToken(token);
        if (!user) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_TOKEN'));
        }
        const payments = await paymentModel.getPaymentsByUser(user);
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENTS_RETRIEVED_SUCCESSFULLY'), payments);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
//# sourceMappingURL=payment.controller.js.map