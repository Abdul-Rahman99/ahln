"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = __importDefault(require("../config/i18n"));
const localizationMiddleware = (req, res, next) => {
    const lang = req.headers['accept-language'] || 'en';
    if (lang) {
        i18n_1.default.setLocale(lang);
    }
    next();
};
exports.default = localizationMiddleware;
//# sourceMappingURL=localization.middleware.js.map