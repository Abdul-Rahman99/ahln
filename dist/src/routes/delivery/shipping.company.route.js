"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shipping_company_controller_1 = require("../../controllers/delivery/shipping.company.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const shipping_company_validation_1 = require("../../validation/delivery/shipping.company.validation");
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, shipping_company_validation_1.createShippingCompanyValidation, shipping_company_controller_1.createShippingCompany);
router.get('/get-all', verifyToken_1.default, shipping_company_controller_1.getAllShippingCompanies);
router.get('/get-one/:id', verifyToken_1.default, shipping_company_validation_1.getShippingCompanyIdValidation, shipping_company_controller_1.getShippingCompanyById);
router.put('/update/:id', verifyToken_1.default, shipping_company_validation_1.updateShippingCompanyValidation, shipping_company_controller_1.updateShippingCompany);
router.delete('/delete/:id', verifyToken_1.default, shipping_company_validation_1.deleteShippingCompanyIdValidation, shipping_company_controller_1.deleteShippingCompany);
exports.default = router;
//# sourceMappingURL=shipping.company.route.js.map