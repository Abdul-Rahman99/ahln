"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const box_generation_controller_1 = require("../../controllers/box/box.generation.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, (0, authorize_1.authorize)(['create_box']), box_generation_controller_1.createBoxGeneration);
router.get('/get-all', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), box_generation_controller_1.getAllBoxGenerations);
router.get('/get-one/:id', verifyToken_1.default, (0, authorize_1.authorize)(['read_box']), box_generation_controller_1.getBoxGenerationById);
router.put('/update/:id', verifyToken_1.default, (0, authorize_1.authorize)(['update_box']), box_generation_controller_1.updateBoxGeneration);
router.delete('/delete/:id', verifyToken_1.default, (0, authorize_1.authorize)(['delete_box']), box_generation_controller_1.deleteBoxGeneration);
exports.default = router;
//# sourceMappingURL=box.generation.route.js.map