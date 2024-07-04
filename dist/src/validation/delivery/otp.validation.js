"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTrackingNumberValidation = exports.getOTPsByUserValidation = exports.deleteOneOTPValidation = exports.updateOneOTPValidation = exports.getOneOTPValidation = exports.checkOTPValidation = exports.createOTPValidation = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createOTPValidation = [
    (0, express_validator_1.body)('box_id').notEmpty().withMessage('box_id is required'),
    (0, express_validator_1.body)('box_locker_id').notEmpty().withMessage('box_locker_id is required'),
    (0, express_validator_1.body)('box_locker_string')
        .notEmpty()
        .withMessage('box_locker_string is required'),
    (0, express_validator_1.body)('delivery_package_id')
        .notEmpty()
        .withMessage('delivery_package_id is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    validatorMiddleware_1.default,
];
exports.checkOTPValidation = [
    (0, express_validator_1.body)('otp').notEmpty().withMessage('otp is required'),
    (0, express_validator_1.body)('deliveryPackageId')
        .notEmpty()
        .withMessage('deliveryPackageId is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    validatorMiddleware_1.default,
];
exports.getOneOTPValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage('id must be an integer'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    validatorMiddleware_1.default,
];
exports.updateOneOTPValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage('id must be an integer'),
    (0, express_validator_1.body)('box_id').optional().notEmpty().withMessage('box_id cannot be empty'),
    (0, express_validator_1.body)('box_locker_id')
        .optional()
        .notEmpty()
        .withMessage('box_locker_id cannot be empty'),
    (0, express_validator_1.body)('is_used')
        .optional()
        .isBoolean()
        .withMessage('is_used must be a boolean'),
    (0, express_validator_1.body)('box_locker_string')
        .optional()
        .notEmpty()
        .withMessage('box_locker_string cannot be empty'),
    (0, express_validator_1.body)('delivery_package_id')
        .optional()
        .notEmpty()
        .withMessage('delivery_package_id cannot be empty'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    validatorMiddleware_1.default,
];
exports.deleteOneOTPValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage('id must be an integer'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    validatorMiddleware_1.default,
];
exports.getOTPsByUserValidation = [
    (0, express_validator_1.param)('userId').notEmpty().withMessage('userId is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    validatorMiddleware_1.default,
];
exports.checkTrackingNumberValidation = [
    (0, express_validator_1.query)('trackingNumber').notEmpty().withMessage('trackingNumber is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    validatorMiddleware_1.default,
];
//# sourceMappingURL=otp.validation.js.map