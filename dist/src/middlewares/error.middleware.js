"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const config_1 = require("../../config");
const nodeEnv = config_1.config.NODE_ENV;
const errorMiddleware = (err, req, res, next) => {
    const customError = {
        statusCode: res.statusCode !== 200 ? res.statusCode : 500,
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
//# sourceMappingURL=error.middleware.js.map