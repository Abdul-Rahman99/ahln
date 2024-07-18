"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesInvoicesByBoxId = exports.getSalesInvoicesBySalesId = exports.getSalesInvoicesByUserId = exports.deleteSalesInvoice = exports.updateSalesInvoice = exports.getSalesInvoiceById = exports.getAllSalesInvoices = exports.createSalesInvoice = void 0;
const sales_invoice_model_1 = __importDefault(require("../../models/payment/sales.invoice.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const box_model_1 = __importDefault(require("../../models/box/box.model"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const notification_model_1 = __importDefault(require("../../models/logs/notification.model"));
const notificationModel = new notification_model_1.default();
const auditTrail = new audit_trail_model_1.default();
const systemLog = new system_log_model_1.default();
const salesInvoiceModel = new sales_invoice_model_1.default();
const userModel = new user_model_1.default();
const boxModel = new box_model_1.default();
const parseDate = (dateString) => {
    const [month, day, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? null : date;
};
exports.createSalesInvoice = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newSalesInvoicePayload = req.body;
        const user = await (0, authHandler_1.default)(req, res, next);
        const userExist = await userModel.getOne(user);
        if (!userExist) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'createSalesInvoice';
            systemLog.createSystemLog(user, 'User Not Found', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_NOT_FOUND'));
        }
        const box = await boxModel.getOne(newSalesInvoicePayload.box_id);
        if (!box) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'createSalesInvoice';
            systemLog.createSystemLog(user, 'Box Not Found', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('BOX_NOT_FOUND'));
        }
        const parsedDate = parseDate(newSalesInvoicePayload.purchase_date);
        if (!parsedDate) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'createSalesInvoice';
            systemLog.createSystemLog(user, 'Invalid Date Format', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_DATE_FORMAT'));
        }
        const newSalesInvoice = {
            ...newSalesInvoicePayload,
            purchase_date: parsedDate,
        };
        const createdSalesInvoice = await salesInvoiceModel.createSalesInvoice(newSalesInvoice, user);
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICE_CREATED_SUCCESSFULLY'), createdSalesInvoice);
        notificationModel.createNotification('createSalesInvoice', i18n_1.default.__('SALES_INVOICE_CREATED_SUCCESSFULLY'), null, user);
        const action = 'createSalesInvoice';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('SALES_INVOICE_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'createSalesInvoice';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllSalesInvoices = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const salesInvoices = await salesInvoiceModel.getAllSalesInvoices();
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICES_RETRIEVED_SUCCESSFULLY'), salesInvoices);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getAllSalesInvoices';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getSalesInvoiceById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const salesInvoiceId = req.params.id;
        const salesInvoice = await salesInvoiceModel.getOne(salesInvoiceId);
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICE_RETRIEVED_SUCCESSFULLY'), salesInvoice);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getSalesInvoiceById';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateSalesInvoice = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const salesInvoiceId = req.params.id;
        const newSalesInvoicePayload = req.body;
        const parsedDate = parseDate(newSalesInvoicePayload.purchase_date);
        if (!parsedDate) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'updateSalesInvoice';
            systemLog.createSystemLog(user, 'Invalid Date Format', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_DATE_FORMAT'));
        }
        const newSalesInvoice = {
            ...newSalesInvoicePayload,
            purchase_date: parsedDate,
        };
        const updatedSalesInvoice = await salesInvoiceModel.updateOne(newSalesInvoice, salesInvoiceId);
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICE_UPDATED_SUCCESSFULLY'), updatedSalesInvoice);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'updateSalesInvoice';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('SALES_INVOICE_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'updateSalesInvoice';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteSalesInvoice = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const salesInvoiceId = req.params.id;
        const deletedSalesInvoice = await salesInvoiceModel.deleteOne(salesInvoiceId);
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICE_DELETED_SUCCESSFULLY'), deletedSalesInvoice);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'deleteSalesInvoice';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('SALES_INVOICE_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'deleteSalesInvoice';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getSalesInvoicesByUserId = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const user = req.body.salesId;
        const salesInvoices = await salesInvoiceModel.getSalesInvoicesByUserId(user);
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICES_BY_USER_ID_RETRIEVED_SUCCESSFULLY'), salesInvoices);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getSalesInvoiceByUserId';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getSalesInvoicesBySalesId = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const user = req.body.userId;
        const salesInvoices = await salesInvoiceModel.getSalesInvoicesByUserId(user);
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICES_BY_USER_ID_RETRIEVED_SUCCESSFULLY'), salesInvoices);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getSalesInvoicesBySalesId';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getSalesInvoicesByBoxId = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxId = req.params.boxId;
        const salesInvoices = await salesInvoiceModel.getSalesInvoicesByBoxId(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'), salesInvoices);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getSalesInvoicesByBoxId';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=sales.invoice.controller.js.map