"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoxImagesByPackageId = exports.getBoxImagesByBoxId = exports.getAllBoxImages = exports.uploadBoxImage = void 0;
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const box_image_model_1 = __importDefault(require("../../models/box/box.image.model"));
const uploadSingleImage_1 = require("../../middlewares/uploadSingleImage");
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const notification_model_1 = __importDefault(require("../../models/logs/notification.model"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const user_devices_model_1 = __importDefault(require("../../models/users/user.devices.model"));
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const userModel = new user_model_1.default();
const userDevicesModel = new user_devices_model_1.default();
const auditTrail = new audit_trail_model_1.default();
const notificationModel = new notification_model_1.default();
const systemLog = new system_log_model_1.default();
const boxImageModel = new box_image_model_1.default();
exports.uploadBoxImage = (0, asyncHandler_1.default)(async (req, res) => {
    (0, uploadSingleImage_1.uploadSingleImage)('image')(req, res, async (err) => {
        const user = await (0, authHandler_1.default)(req, res);
        if (err) {
            const source = 'uploadBoxImage';
            systemLog.createSystemLog(user, err.message, source);
            return responsesHandler_1.default.badRequest(res, err.message);
        }
        if (!req.file) {
            const source = 'uploadBoxImage';
            systemLog.createSystemLog(user, 'No File Provided', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('NO_FILE_PROVIDED'));
        }
        const { boxId, deliveryPackageId } = req.body;
        const imageName = req.file.filename;
        try {
            const user = await (0, authHandler_1.default)(req, res);
            const createdBoxImage = await boxImageModel.createBoxImage(boxId, deliveryPackageId, imageName);
            responsesHandler_1.default.success(res, i18n_1.default.__('IMAGE_UPLOADED_SUCCESSFULLY'), createdBoxImage);
            notificationModel.createNotification('uploadBoxImage', i18n_1.default.__('IMAGE_UPLOADED_SUCCESSFULLY'), imageName, user);
            const action = 'uploadSingleImage';
            auditTrail.createAuditTrail(user, action, i18n_1.default.__('IMAGE_UPLOADED_SUCCESSFULLY'));
            const userFcm = await userModel.findUserByBoxId(boxId);
            const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(userFcm);
            try {
                notificationModel.pushNotification(fcmToken, i18n_1.default.__('DELIVERY_MAN_ARRIEVED'), i18n_1.default.__('DELIVERY_MAN_TRIES_TO_OPEN_BOX'));
            }
            catch (error) {
                const source = 'updateRelativeCustomer';
                systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
            }
        }
        catch (error) {
            const source = 'uploadBoxImage';
            systemLog.createSystemLog(user, error.message, source);
            responsesHandler_1.default.badRequest(res, error.message);
        }
    });
});
exports.getAllBoxImages = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    const boxId = req.body.box_id;
    try {
        const boxImages = await boxImageModel.getAllBoxImages(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'), boxImages);
    }
    catch (error) {
        const source = 'getAllBoxImages';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxImagesByBoxId = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxId = req.params.boxId;
        const boxImages = await boxImageModel.getBoxImagesByBoxId(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'), boxImages);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'getBoxImagesByBoxId';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxImagesByPackageId = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const packageId = req.params.packageId;
        const boxImages = await boxImageModel.getBoxImagesByPackageId(packageId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'), boxImages);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'getBoxImagesByPackageId';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=box.image.controller.js.map