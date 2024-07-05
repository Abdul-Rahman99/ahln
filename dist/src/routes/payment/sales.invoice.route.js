"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sales_invoice_controller_1 = require("../../controllers/payment/sales.invoice.controller");
const sales_invoice_validation_1 = require("../../validation/payment/sales.invoice.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, sales_invoice_validation_1.createSalesInvoiceValidation, sales_invoice_controller_1.createSalesInvoice);
router.get('/get-all', verifyToken_1.default, sales_invoice_controller_1.getAllSalesInvoices);
router.get('/get-one/:id', verifyToken_1.default, sales_invoice_validation_1.getSalesInvoiceByIdValidation, sales_invoice_controller_1.getSalesInvoiceById);
router.put('/update/:id', verifyToken_1.default, sales_invoice_validation_1.updateSalesInvoiceValidation, sales_invoice_controller_1.updateSalesInvoice);
router.delete('/delete/:id', verifyToken_1.default, sales_invoice_validation_1.deleteSalesInvoiceValidation, sales_invoice_controller_1.deleteSalesInvoice);
router.get('/get-user-sales-invoices', verifyToken_1.default, sales_invoice_validation_1.getSalesInvoicesByUserIdValidation, sales_invoice_controller_1.getSalesInvoicesByUserId);
router.get('/get-sales-sales-invoices', verifyToken_1.default, sales_invoice_validation_1.getSalesInvoicesBySalesIdValidation, sales_invoice_controller_1.getSalesInvoicesBySalesId);
router.get('/get-box-sales-invoices', verifyToken_1.default, sales_invoice_validation_1.getSalesInvoicesByBoxIdValidation, sales_invoice_controller_1.getSalesInvoicesByBoxId);
exports.default = router;
//# sourceMappingURL=sales.invoice.route.js.map