import { UserDevice } from '../../types/user.devices';
declare class UserDevicesModel {
    saveUserDevice(userId: string, fcmToken: string): Promise<void>;
    getUserDeviceById(deviceId: number): Promise<UserDevice | null>;
    getFcmTokenDevicesByUser(user: string): Promise<any | []>;
    getAllUserDevices(userId: string): Promise<UserDevice[]>;
    updateUserDevice(deviceId: number, fcmToken: string): Promise<UserDevice>;
    deleteUserDevice(deviceId: number): Promise<UserDevice>;
}
export default UserDevicesModel;
