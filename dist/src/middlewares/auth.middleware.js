"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/users/user.model"));
const responsesHandler_1 = __importDefault(require("../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../config/i18n"));
const userModel = new user_model_1.default();
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('TOKEN_NOT_PROVIDED'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await userModel.getOne(decoded.id);
        if (!user) {
            return responsesHandler_1.default.unauthorized(res, i18n_1.default.__('INVALID_TOKEN'));
        }
        req.user = user;
        next();
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('AUTHENTICATION_FAILED'), error.message);
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map