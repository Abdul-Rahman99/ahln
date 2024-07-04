"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const box_image_controller_1 = require("../../controllers/box/box.image.controller");
const router = express_1.default.Router();
router.post('/new', box_image_controller_1.uploadBoxImage);
router.get('/get-all', box_image_controller_1.getAllBoxImages);
router.get('/get-one/:id', box_image_controller_1.getBoxImageById);
router.put('/update/:id', box_image_controller_1.updateBoxImage);
router.delete('/delete/:id', box_image_controller_1.deleteBoxImage);
router.get('/images-by-box/:boxId', box_image_controller_1.getBoxImagesByBoxId);
router.get('/images-by-package/:packageId', box_image_controller_1.getBoxImagesByPackageId);
exports.default = router;
//# sourceMappingURL=box.image.route.js.map