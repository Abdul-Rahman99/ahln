"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_controller_1 = require("../../controllers/delivery/image.controller");
const image_controller_2 = require("../../controllers/delivery/image.controller");
const image_controller_3 = require("../../controllers/delivery/image.controller");
const router = (0, express_1.Router)();
router.post('/upload', image_controller_1.uploadImage);
router.post('/livestream', image_controller_2.liveStream);
router.get('/getLiveStreamImage/:id', image_controller_3.getLiveStreamImage);
exports.default = router;
//# sourceMappingURL=image.route.js.map