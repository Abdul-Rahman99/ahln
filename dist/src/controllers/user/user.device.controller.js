"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDeviceById = exports.getDevicesByUser = exports.updateDevice = exports.deleteDevice = void 0;
const user_devices_model_1 = __importDefault(require("../../models/users/user.devices.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const auditTrail = new audit_trail_model_1.default();
const systemLog = new system_log_model_1.default();
const userDevicesModel = new user_devices_model_1.default();
const deleteDevice = async (req, res) => {
    const { deviceId } = req.params;
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const deletedDevice = await userDevicesModel.deleteUserDevice(parseInt(deviceId, 10));
        responsesHandler_1.default.success(res, i18n_1.default.__('DEVICE_DELETED_SUCCESSFULLY'), deletedDevice);
        const action = 'deletedDevice';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('DEVICE_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'deleteDevice';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.deleteDevice = deleteDevice;
const updateDevice = async (req, res) => {
    const { deviceId } = req.params;
    const { fcm_token } = req.body;
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const updatedDevice = await userDevicesModel.updateUserDevice(parseInt(deviceId, 10), fcm_token);
        responsesHandler_1.default.success(res, i18n_1.default.__('DEVICE_UPDATED_SUCCESSFULLY'), updatedDevice);
        const action = 'updateDevice';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('DEVICE_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'updateDevice';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.updateDevice = updateDevice;
const getDevicesByUser = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const devices = await userDevicesModel.getAllUserDevices(user);
        responsesHandler_1.default.success(res, i18n_1.default.__('DEVICE_RETRIVED_BY_USER_SUCCESSFULLY'), devices);
    }
    catch (error) {
        const source = 'getDevicesByUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.getDevicesByUser = getDevicesByUser;
const getUserDeviceById = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { deviceId } = req.params;
        const device = await userDevicesModel.getUserDeviceById(parseInt(deviceId));
        if (!device) {
            const source = 'getUserDeviceById';
            systemLog.createSystemLog(user, 'User Device Not Found', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_DEVICE_NOT_FOUND'));
        }
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'), device);
    }
    catch (error) {
        const source = 'getUserDeviceById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.getUserDeviceById = getUserDeviceById;
//# sourceMappingURL=user.device.controller.js.map