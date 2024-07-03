"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLockersById = exports.deleteBoxLocker = exports.updateBoxLocker = exports.getBoxLockerById = exports.getAllBoxLockers = exports.createBoxLocker = void 0;
const box_locker_model_1 = __importDefault(require("../../models/box/box.locker.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const boxLockerModel = new box_locker_model_1.default();
exports.createBoxLocker = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const newBoxLocker = req.body;
        const createdBoxLocker = await boxLockerModel.createBoxLocker(newBoxLocker);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKER_CREATED_SUCCESSFULLY'), createdBoxLocker);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_LOCKER_CREATION_FAILED'), error.message);
    }
});
exports.getAllBoxLockers = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxLockers = await boxLockerModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKERS_RETRIEVED_SUCCESSFULLY'), boxLockers);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_LOCKERS_RETRIEVAL_FAILED'), error.message);
    }
});
exports.getBoxLockerById = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxLockerId = req.params.id;
        const boxLocker = await boxLockerModel.getOne(String(boxLockerId));
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKER_RETRIEVED_SUCCESSFULLY'), boxLocker);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_LOCKER_RETRIEVAL_FAILED'), error.message);
    }
});
exports.updateBoxLocker = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxLockerId = req.params.id;
        const boxLockerData = req.body;
        const updatedBoxLocker = await boxLockerModel.updateOne(boxLockerData, Number(boxLockerId));
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKER_UPDATED_SUCCESSFULLY'), updatedBoxLocker);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_LOCKER_UPDATE_FAILED'), error.message);
    }
});
exports.deleteBoxLocker = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxLockerId = req.params.id;
        const deletedBoxLocker = await boxLockerModel.deleteOne(Number(boxLockerId));
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKER_DELETED_SUCCESSFULLY'), deletedBoxLocker);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_LOCKER_DELETION_FAILED'), error.message);
    }
});
exports.getAllLockersById = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxId = req.body.boxId;
        const boxLockers = await boxLockerModel.getAllLockersById(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKERS_RETRIEVED_SUCCESSFULLY'), boxLockers);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_LOCKERS_RETRIEVAL_FAILED'), error.message);
    }
});
//# sourceMappingURL=box.locker.controller.js.map