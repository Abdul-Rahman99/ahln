"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (fn) => function asyncUtilWrap(req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
exports.default = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map