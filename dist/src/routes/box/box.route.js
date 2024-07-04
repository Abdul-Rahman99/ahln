"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const box_controller_1 = require("../../controllers/box/box.controller");
const box_validation_1 = require("../../validation/box/box.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, (0, authorize_1.authorize)(['create_box']), box_validation_1.createBoxValidation, box_controller_1.createBox);
router.get('/get-all', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), box_controller_1.getAllBoxes);

router.get('/get-one/:id', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), box_validation_1.getBoxByIdValidation, box_controller_1.getBoxById);
router.put('/update/:id', verifyToken_1.default, (0, authorize_1.authorize)(['update_box']), box_validation_1.updateBoxValidation, box_controller_1.updateBox);
router.delete('/delete/:id', verifyToken_1.default, (0, authorize_1.authorize)(['delete_box']), box_validation_1.deleteBoxValidation, box_controller_1.deleteBox);
router.get('/get-all/boxes-generation/:generationId', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), box_validation_1.getBoxGenerationByIdValidation, box_controller_1.getBoxesByGenerationId);

router.post('/set-tablet-id', box_controller_1.getBoxByTabletInfo);
router.post('/assign-tablet-to-box', verifyToken_1.default, (0, authorize_1.authorize)(['create_tablet']), box_controller_1.assignTabletToBox);
router.post('/reset-tablet-to-box', verifyToken_1.default, (0, authorize_1.authorize)(['create_tablet']), box_controller_1.resetTabletId);

exports.default = router;
//# sourceMappingURL=box.route.js.map