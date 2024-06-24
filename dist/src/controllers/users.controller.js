"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/users/user.model"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../config/i18n"));
const userModel = new user_model_1.default();
exports.createUser = (0, asyncHandler_1.default)(async (req, res) => {
    const newUser = req.body;
    const createdUser = await userModel.createUser(newUser);
    res.status(201).json({
        message: i18n_1.default.__('USER_CREATED_SUCCESSFULLY'),
        data: createdUser,
    });
});
exports.getAllUsers = (0, asyncHandler_1.default)(async (req, res) => {
    const users = await userModel.getMany();
    res.json(users);
});
exports.getUserById = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.params.id;
    const user = await userModel.getOne(userId);
    res.json(user);
});
exports.updateUser = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    const updatedUser = await userModel.updateOne(userData, userId);
    res.json({ message: i18n_1.default.__('USER_UPDATED_SUCCESSFULLY'), updatedUser });
});
exports.deleteUser = (0, asyncHandler_1.default)(async (req, res) => {
    const userId = req.params.id;
    const deletedUser = await userModel.deleteOne(userId);
    res.json({ message: i18n_1.default.__('USER_DELETED_SUCCESSFULLY'), deletedUser });
});
//# sourceMappingURL=users.controller.js.map