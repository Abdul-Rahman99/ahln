"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignBoxToUser = exports.getUserBoxesByBoxId = exports.getUserBoxesByUserId = exports.deleteUserBox = exports.updateUserBox = exports.getUserBoxById = exports.getAllUserBoxes = exports.createUserBox = void 0;
const user_box_model_1 = __importDefault(require("../../models/box/user.box.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const userModel = new user_model_1.default();
const userBoxModel = new user_box_model_1.default();
exports.createUserBox = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newUserBox = req.body;
        const createdUserBox = await userBoxModel.createUserBox(newUserBox);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOX_CREATED_SUCCESSFULLY'), createdUserBox);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllUserBoxes = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const userBoxes = await userBoxModel.getAllUserBoxes();
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOXES_RETRIEVED_SUCCESSFULLY'), userBoxes);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getUserBoxById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const userBoxId = req.params.id;
        const userBox = await userBoxModel.getOne(userBoxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOX_RETRIEVED_SUCCESSFULLY'), userBox);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateUserBox = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const userBoxId = req.params.id;
        const userBoxData = req.body;
        const updatedUserBox = await userBoxModel.updateOne(userBoxData, userBoxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOX_UPDATED_SUCCESSFULLY'), updatedUserBox);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteUserBox = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const userBoxId = req.params.id;
        const deletedUserBox = await userBoxModel.deleteOne(userBoxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOX_DELETED_SUCCESSFULLY'), deletedUserBox);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getUserBoxesByUserId = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('TOKEN_NOT_PROVIDED'));
        }
        const user = await userModel.findByToken(token);
        if (!user) {
            return responsesHandler_1.default.unauthorized(res, i18n_1.default.__('INVALID_TOKEN'));
        }
        const userBoxes = await userBoxModel.getUserBoxesByUserId(user);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOXES_BY_USER_ID_RETRIEVED_SUCCESSFULLY'), userBoxes);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getUserBoxesByBoxId = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxId = req.params.boxId;
        const userBoxes = await userBoxModel.getUserBoxesByBoxId(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOXES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'), userBoxes);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.assignBoxToUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const { userId, boxId } = req.body;
        const assignedUserBox = await userBoxModel.assignBoxToUser(userId, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'), assignedUserBox);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=user.box.controller.js.map