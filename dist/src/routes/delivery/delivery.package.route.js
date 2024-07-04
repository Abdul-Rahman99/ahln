"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const delivery_package_controller_1 = require("../../controllers/delivery/delivery.package.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const delivery_package_validation_1 = require("../../validation/delivery/delivery.package.validation");
const router = (0, express_1.Router)();
router.post('/new', verifyToken_1.default, delivery_package_validation_1.createDeliveryPackageValidation, delivery_package_controller_1.createDeliveryPackage);
router.get('/get-all', verifyToken_1.default, delivery_package_controller_1.getAllDeliveryPackages);
router.get('/get-one/:id', verifyToken_1.default, delivery_package_validation_1.getDeliveryPackageByIdValidation, delivery_package_controller_1.getDeliveryPackageById);
router.put('/update/:id', verifyToken_1.default, delivery_package_validation_1.updateDeliveryPackageValidation, delivery_package_controller_1.updateDeliveryPackage);
router.delete('/delete/:id', verifyToken_1.default, delivery_package_validation_1.deleteDeliveryPackageValidation, delivery_package_controller_1.deleteDeliveryPackage);
router.get('/user/delivery-packages/:shipment_status', delivery_package_validation_1.getUserDeliveryPackagesValidation, delivery_package_controller_1.getUserDeliveryPackages);
exports.default = router;
//# sourceMappingURL=delivery.package.route.js.map