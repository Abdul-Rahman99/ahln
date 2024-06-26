"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_controller_1 = require("../../controllers/box/address.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, (0, authorize_1.authorize)(['create_box']), address_controller_1.createAddress);
router.get('/get-all', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), address_controller_1.getAllAddresses);
router.get('/get-one/:id', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), address_controller_1.getAddressById);
router.put('/update/:id', verifyToken_1.default, (0, authorize_1.authorize)(['update_box']), address_controller_1.updateAddress);
router.delete('/delete/:id', verifyToken_1.default, (0, authorize_1.authorize)(['delete_box']), address_controller_1.deleteAddress);
exports.default = router;
//# sourceMappingURL=address.route.js.map