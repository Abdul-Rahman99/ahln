"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDeviceById = exports.getDevicesByUser = exports.updateDevice = exports.deleteDevice = exports.registerDevice = void 0;
const user_devices_model_1 = __importDefault(require("../../models/users/user.devices.model"));
const userDevicesModel = new user_devices_model_1.default();
const registerDevice = async (req, res) => {
    const { fcm_token } = req.body;
    const { id: user_id } = req.currentUser;
    try {
        await userDevicesModel.saveUserDevice(user_id, fcm_token);
        res.status(201).json({ message: 'Device registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerDevice = registerDevice;
const deleteDevice = async (req, res) => {
    const { deviceId } = req.params;
    try {
        const deletedDevice = await userDevicesModel.deleteUserDevice(parseInt(deviceId, 10));
        res
            .status(200)
            .json({ message: 'Device deleted successfully', device: deletedDevice });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteDevice = deleteDevice;
const updateDevice = async (req, res) => {
    const { deviceId } = req.params;
    const { fcm_token } = req.body;
    try {
        const updatedDevice = await userDevicesModel.updateUserDevice(parseInt(deviceId, 10), fcm_token);
        res
            .status(200)
            .json({ message: 'Device updated successfully', device: updatedDevice });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateDevice = updateDevice;
const getDevicesByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const devices = await userDevicesModel.getAllUserDevices(userId);
        res.status(200).json(devices);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDevicesByUser = getDevicesByUser;
const getUserDeviceById = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const device = await userDevicesModel.getUserDeviceById(parseInt(deviceId));
        if (!device) {
            return res.status(404).json({
                message: i18n.__('USER_DEVICE_NOT_FOUND', { deviceId }),
            });
        }
        res.status(200).json(device);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserDeviceById = getUserDeviceById;
//# sourceMappingURL=user.device.controller.js.map