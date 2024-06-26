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
const userModel = new user_model_1.default();
exports.createUser = (0, asyncHandler_1.default)(async (req, res) => {
    const newUser = req.body;
    try {
        const createdUser = await userModel.createUser(newUser);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_CREATED_SUCCESSFULLY'), createdUser);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, error.message);
    }
});
exports.getAllUsers = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const users = await userModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('USERS_RETRIEVED_SUCCESSFULLY'), users);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, error.message);
    }
});
exports.getUserById = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userModel.getOne(userId);
        if (!user) {
            responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_NOT_FOUND'));
        }
        else {
            responsesHandler_1.default.success(res, i18n_1.default.__('USER_RETRIEVED_SUCCESSFULLY'), user);
        }
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, error.message);
    }
});
exports.updateUser = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    try {
        const updatedUser = await userModel.updateOne(userData, userId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_UPDATED_SUCCESSFULLY'), updatedUser);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, error.message);
    }
});
exports.deleteUser = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await userModel.deleteOne(userId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_DELETED_SUCCESSFULLY'), deletedUser);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, error.message);
    }
});
//# sourceMappingURL=users.controller.js.map