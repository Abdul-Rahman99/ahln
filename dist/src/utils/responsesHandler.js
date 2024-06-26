"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseHandler {
    static success(res, message, data = null, token = null) {
        const responseBody = {
            success: true,
            message,
            data,
        };
        if (token) {
            responseBody.token = token;
        }
        return res.status(200).json(responseBody);
    }
    static badRequest(res, message, data = null) {
        return res.status(400).json({
            success: false,
            message,
            data,
        });
    }
    static internalError(res, message, data = null) {
        return res.status(500).json({
            success: false,
            message,
            data,
        });
    }
}
exports.default = ResponseHandler;
//# sourceMappingURL=responsesHandler.js.map