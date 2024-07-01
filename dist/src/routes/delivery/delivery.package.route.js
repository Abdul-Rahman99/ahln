"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const delivery_package_controller_1 = require("../../controllers/delivery/delivery.package.controller");
const router = (0, express_1.Router)();
router.post('/new', delivery_package_controller_1.createDeliveryPackage);
router.get('/get-all', delivery_package_controller_1.getAllDeliveryPackages);
router.get('/get-one/:id', delivery_package_controller_1.getDeliveryPackageById);
router.put('/update/:id', delivery_package_controller_1.updateDeliveryPackage);
router.delete('/delete/:id', delivery_package_controller_1.deleteDeliveryPackage);
router.get('/user/delivery-packages', delivery_package_controller_1.getUserDeliveryPackages);
exports.default = router;
//# sourceMappingURL=delivery.package.route.js.map