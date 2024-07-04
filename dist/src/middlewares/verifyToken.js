"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const i18n_1 = __importDefault(require("../config/i18n"));
const config_1 = __importDefault(require("../../config"));
const responsesHandler_1 = __importDefault(require("../utils/responsesHandler"));
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('TOKEN_REQUIRED'));
    }
    try {
        if (!config_1.default.JWT_SECRET_KEY) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('JWT_UNDEFINED'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.JsonWebTokenError ||
            err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return responsesHandler_1.default.unauthorized(res, i18n_1.default.__('INVALID_TOKEN'));
        }
        return responsesHandler_1.default.internalError(res, i18n_1.default.__('SERVER_ERROR'));
    }
};
exports.default = verifyToken;
//# sourceMappingURL=verifyToken.js.map