"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDeviceById = exports.getDevicesByUser = exports.updateDevice = exports.deleteDevice = exports.registerDevice = void 0;
const user_devices_model_1 = __importDefault(require("../../models/users/user.devices.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const userDevicesModel = new user_devices_model_1.default();
const registerDevice = async (req, res, next) => {
    const { fcm_token } = req.body;
    const { id: user_id } = req.currentUser;
    try {
        const savedDevice = await userDevicesModel.saveUserDevice(user_id, fcm_token);
        responsesHandler_1.default.success(res, i18n_1.default.__('DEVICE_REGISTERED_SUCCESSFULLY'), savedDevice);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.registerDevice = registerDevice;
const deleteDevice = async (req, res, next) => {
    const { deviceId } = req.params;
    try {
        const deletedDevice = await userDevicesModel.deleteUserDevice(parseInt(deviceId, 10));
        responsesHandler_1.default.success(res, i18n_1.default.__('DEVICE_DELETED_SUCCESSFULLY'), deletedDevice);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.deleteDevice = deleteDevice;
const updateDevice = async (req, res, next) => {
    const { deviceId } = req.params;
    const { fcm_token } = req.body;
    try {
        const updatedDevice = await userDevicesModel.updateUserDevice(parseInt(deviceId, 10), fcm_token);
        responsesHandler_1.default.success(res, i18n_1.default.__('DEVICE_UPDATED_SUCCESSFULLY'), updatedDevice);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.updateDevice = updateDevice;
const getDevicesByUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const devices = await userDevicesModel.getAllUserDevices(userId);
        responsesHandler_1.default.success(res, i18n_1.default.__('DEVICE_RETRIVED_BY_USER_SUCCESSFULLY'), devices);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.getDevicesByUser = getDevicesByUser;
const getUserDeviceById = async (req, res, next) => {
    try {
        const { deviceId } = req.params;
        const device = await userDevicesModel.getUserDeviceById(parseInt(deviceId));
        if (!device) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_DEVICE_NOT_FOUND'));
        }
        responsesHandler_1.default.success(res, i18n_1.default.__('SALES_INVOICES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'), device);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.getUserDeviceById = getUserDeviceById;
//# sourceMappingURL=user.device.controller.js.map