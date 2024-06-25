"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tablet_controller_1 = require("../../controllers/box/tablet.controller");
const tablet_validation_1 = require("../../validation/box/tablet.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, (0, authorize_1.authorize)(['create_tablet']), tablet_validation_1.createTabletValidator, tablet_controller_1.createTablet);
router.get('/get-all', verifyToken_1.default, (0, authorize_1.authorize)(['read_tablet']), tablet_controller_1.getAllTablets);
router.get('/get-one/:id', verifyToken_1.default, (0, authorize_1.authorize)(['read_tablet']), tablet_validation_1.getTabletValidator, tablet_controller_1.getTabletById);
router.put('/update/:id', verifyToken_1.default, (0, authorize_1.authorize)(['update_tablet']), tablet_validation_1.updateTabletValidator, tablet_controller_1.updateTablet);
router.delete('/delete/:id', verifyToken_1.default, (0, authorize_1.authorize)(['delete_tablet']), tablet_validation_1.deleteTabletValidator, tablet_controller_1.deleteTablet);
exports.default = router;
//# sourceMappingURL=tablet.route.js.map