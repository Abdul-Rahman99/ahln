"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const responsesHandler_1 = __importDefault(require("../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../config/i18n"));
const validatorMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.type,
            message: error.msg,
        }));
        responsesHandler_1.default.badRequest(res, i18n_1.default.__('VALIDATION_ERROR'), formattedErrors);
        return;
    }
    next();
};
exports.default = validatorMiddleware;
//# sourceMappingURL=validatorMiddleware.js.map