"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const box_controller_1 = require("../../controllers/box/box.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.post('/new', box_controller_1.createBox);
router.get('/get-all', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), box_controller_1.getAllBoxes);
router.get('/get-one/:id', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), box_controller_1.getBoxById);
router.put('/update/:id', verifyToken_1.default, (0, authorize_1.authorize)(['update_box']), box_controller_1.updateBox);
router.delete('/delete/:id', verifyToken_1.default, (0, authorize_1.authorize)(['delete_box']), box_controller_1.deleteBox);
router.get('/get-all/boxes-generation/:generationId', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), box_controller_1.getBoxesByGenerationId);
exports.default = router;
//# sourceMappingURL=box.route.js.map