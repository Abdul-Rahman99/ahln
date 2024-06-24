"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.handleErrorResponse = exports.errorMiddleware = void 0;
const config_1 = require("../../config");
const error_type_1 = __importDefault(require("../types/error.type"));
const nodeEnv = config_1.config.NODE_ENV;
const errorMiddleware = (err, req, res) => {
    const customError = {
        statusCode: res.statusCode || 500,
        message: err.message || 'Internal Server Error',
    };
    if (err.name === 'CastError') {
        customError.statusCode = 403;
        customError.message = `Resource not found. Invalid: ${err.message}`;
    }
    if (err.code === 11000) {
        customError.statusCode = 403;
        customError.message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    }
    if (err.name === 'TokenExpiredError') {
        customError.statusCode = 403;
        customError.message =
            'Unauthorized: You are not allowed to access this resource';
    }
    res.status(customError.statusCode).json({
        success: false,
        status: customError.statusCode,
        message: customError.message,
        stack: nodeEnv === 'development' ? err.stack : null,
    });
};
exports.errorMiddleware = errorMiddleware;
const handleErrorResponse = (error, res) => {
    res.status(500);
    throw new error_type_1.default(nodeEnv === 'development' ? error : 'something went wrong');
};
exports.handleErrorResponse = handleErrorResponse;
const notFound = (req, res, next) => {
    const error = new error_type_1.default(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
//# sourceMappingURL=error.middleware.js.map