"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shipping_company_controller_1 = require("../../controllers/delivery/shipping.company.controller");
const router = express_1.default.Router();
router.post('/new', shipping_company_controller_1.createShippingCompany);
router.get('/get-all', shipping_company_controller_1.getAllShippingCompanies);
router.get('/get-one/:id', shipping_company_controller_1.getShippingCompanyById);
router.put('/update/:id', shipping_company_controller_1.updateShippingCompany);
router.delete('/delete/:id', shipping_company_controller_1.deleteShippingCompany);
exports.default = router;
//# sourceMappingURL=shipping.company.route.js.map