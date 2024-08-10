"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const uploadSingleImage_1 = require("../../middlewares/uploadSingleImage");
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const auditTrail = new audit_trail_model_1.default();
const systemLog = new system_log_model_1.default();
const userModel = new user_model_1.default();
exports.createUser = (0, asyncHandler_1.default)(async (req, res) => {
    const newUser = req.body;
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const createdUser = await userModel.createUser(newUser);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_CREATED_SUCCESSFULLY'), createdUser);
        const action = 'createUser';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('USER_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'createUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllUsers = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const users = await userModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('USERS_RETRIEVED_SUCCESSFULLY'), users);
    }
    catch (error) {
        const source = 'getAllUsers';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getUserById = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.body.id;
    try {
        const user = await userModel.getOne(userId);
        if (!user) {
            const user = await (0, authHandler_1.default)(req, res);
            const source = 'getUserById';
            systemLog.createSystemLog(user, 'User Not Found', source);
            responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_NOT_FOUND'));
        }
        else {
            responsesHandler_1.default.success(res, i18n_1.default.__('USER_RETRIEVED_SUCCESSFULLY'), user);
        }
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'getUserById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    const userId = req.params.userId;
    (0, uploadSingleImage_1.uploadSingleImage)('image')(req, res, async (err) => {
        if (err) {
            const source = 'updateUser';
            systemLog.createSystemLog(user, 'Image Not Uploaded to user', source);
            return responsesHandler_1.default.badRequest(res, err.message);
        }
        const userData = req.body;
        if (req.file) {
            userData.avatar = req.file.filename;
        }
        try {
            let updatedUser;
            if (userId) {
                updatedUser = await userModel.updateOne(userData, userId);
            }
            else {
                updatedUser = await userModel.updateOne(userData, user);
            }
            responsesHandler_1.default.success(res, i18n_1.default.__('USER_UPDATED_SUCCESSFULLY'), updatedUser);
            const action = 'updateUser';
            auditTrail.createAuditTrail(user, action, i18n_1.default.__('USER_UPDATED_SUCCESSFULLY'));
        }
        catch (error) {
            const source = 'updateUser';
            systemLog.createSystemLog(user, error.message, source);
            responsesHandler_1.default.badRequest(res, error.message);
        }
    });
});
exports.deleteUser = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.params.userId;
    try {
        const deletedUser = await userModel.deleteOne(userId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_DELETED_SUCCESSFULLY'), deletedUser);
        const auditUser = await (0, authHandler_1.default)(req, res);
        const action = 'deleteUser';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('USER_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'deleteUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=users.controller.js.map