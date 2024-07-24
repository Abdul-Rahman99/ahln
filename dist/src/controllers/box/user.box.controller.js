"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAssignBoxToRelativeUser = exports.userAssignBoxToHimself = exports.assignBoxToUser = exports.getUserBoxesByBoxId = exports.getUserBoxesByUserId = exports.deleteUserBox = exports.updateUserBox = exports.getUserBoxById = exports.getAllUserBoxes = exports.createUserBox = void 0;
const user_box_model_1 = __importDefault(require("../../models/box/user.box.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const relative_customer_model_1 = __importDefault(require("../../models/users/relative.customer.model"));
const box_model_1 = __importDefault(require("../../models/box/box.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const address_model_1 = __importDefault(require("../../models/box/address.model"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const user_devices_model_1 = __importDefault(require("../../models/users/user.devices.model"));
const notification_model_1 = __importDefault(require("../../models/logs/notification.model"));
const userDevicesModel = new user_devices_model_1.default();
const notificationModel = new notification_model_1.default();
const userModel = new user_model_1.default();
const userBoxModel = new user_box_model_1.default();
const relativeCustomerModel = new relative_customer_model_1.default();
const boxModel = new box_model_1.default();
const addressModel = new address_model_1.default();
const systemLog = new system_log_model_1.default();
const auditTrail = new audit_trail_model_1.default();
exports.createUserBox = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const newUserBox = req.body;
        const createdUserBox = await userBoxModel.createUserBox(newUserBox);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOX_CREATED_SUCCESSFULLY'), createdUserBox);
        const action = 'createUserBox';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('USER_BOX_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'createUserBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllUserBoxes = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const userBoxes = await userBoxModel.getAllUserBoxes();
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOXES_RETRIEVED_SUCCESSFULLY'), userBoxes);
    }
    catch (error) {
        const source = 'getAllUserBoxes';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getUserBoxById = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const userBoxId = req.params.id;
        const userBox = await userBoxModel.getOne(userBoxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOX_RETRIEVED_SUCCESSFULLY'), userBox);
    }
    catch (error) {
        const source = 'getUserBoxById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateUserBox = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const userBoxId = req.params.id;
        const userBoxData = req.body;
        const updatedUserBox = await userBoxModel.updateOne(userBoxData, userBoxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOX_UPDATED_SUCCESSFULLY'), updatedUserBox);
        const action = 'updateUserBox';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('USER_BOX_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'updateUserBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteUserBox = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const userBoxId = req.params.id;
        const deletedUserBox = await userBoxModel.deleteOne(userBoxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOX_DELETED_SUCCESSFULLY'), deletedUserBox);
        const action = 'deleteUserBox';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('USER_BOX_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'deleteUserBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getUserBoxesByUserId = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const userBoxes = await userBoxModel.getUserBoxesByUserId(user);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOXES_BY_USER_ID_RETRIEVED_SUCCESSFULLY'), userBoxes);
    }
    catch (error) {
        const source = 'getUserBoxesByUserId';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getUserBoxesByBoxId = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const boxId = req.params.boxId;
        const userBoxes = await userBoxModel.getUserBoxesByBoxId(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('USER_BOXES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'), userBoxes);
    }
    catch (error) {
        const source = 'getUserBoxesByBoxId';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.assignBoxToUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { userId, boxId } = req.body;
        const assignedUserBox = await userBoxModel.assignBoxToUser(userId, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'), assignedUserBox);
        notificationModel.createNotification('assignBoxToUser', i18n_1.default.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'), null, userId);
        const action = 'assignBoxToUser';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'assignBoxToUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.userAssignBoxToHimself = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { serialNumber } = req.body;
        const newAddress = req.body;
        const result = await addressModel.createAddress(newAddress, user);
        const assignedUserBox = await userBoxModel.userAssignBoxToHimslef(user, serialNumber, result.id);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'), assignedUserBox);
        notificationModel.createNotification('userAssignBoxToHimself', i18n_1.default.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'), null, user);
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
        try {
            notificationModel.pushNotification(fcmToken, i18n_1.default.__('ASSIGN_BOX_TO_USER'), i18n_1.default.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'));
        }
        catch (error) {
            const source = 'userAssignBoxToHimself';
            systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
        }
        const action = 'userAssignBoxToHimself';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('BOX_ASSIGNED_TO_USER_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'userAssignBoxToHimself';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.userAssignBoxToRelativeUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { boxId, email, relation } = req.body;
        const boxExist = await boxModel.getOne(boxId);
        if (!boxExist) {
            const source = 'userAssignBoxToRelativeUser';
            systemLog.createSystemLog(user, 'Box Does Not Exist', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('BOX_DOES_NOT_EXIST'));
        }
        const assignedUserBox = await userBoxModel.assignRelativeUser(user, boxId, email);
        const relative_customer = await userModel.findByEmail(email);
        if (!relative_customer) {
            const source = 'userAssignBoxToRelativeUser';
            systemLog.createSystemLog(user, 'User Does Not Exist', source);
            responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_NOT_EXIST'));
        }
        else {
            const relativeCustomerData = {
                customer_id: user,
                relative_customer_id: relative_customer.id,
                relation: relation,
                box_id: boxId,
            };
            relativeCustomerModel.createRelativeCustomer(relativeCustomerData);
        }
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'), assignedUserBox);
        notificationModel.createNotification('userAssignBoxToRelativeUser', i18n_1.default.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'), null, user);
        const action = 'userAssignBoxToRelativeUser';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'));
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
        try {
            notificationModel.pushNotification(fcmToken, i18n_1.default.__('ASSIGN_BOX_TO_RELATIVE_USER'), i18n_1.default.__('BOX_ASSIGNED_TO_RELATIVE_USER_SUCCESSFULLY'));
        }
        catch (error) {
            const source = 'userAssignBoxToRelativeUser';
            systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
        }
    }
    catch (error) {
        const source = 'userAssignBoxToRelativeUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=user.box.controller.js.map