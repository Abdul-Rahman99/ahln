import { OTP } from '../../types/otp.type';
declare class OTPModel {
    createOTP(otpData: Partial<OTP>, delivery_package_id: string): Promise<OTP>;
    checkOTP(otp: string, delivery_package_id: string, boxId: string): Promise<any>;
    getMany(): Promise<OTP[]>;
    getOne(id: number): Promise<OTP>;
    updateOne(otp: Partial<OTP>, id: number): Promise<OTP>;
    deleteOne(id: number): Promise<OTP>;
    getOTPsByUser(userId: string): Promise<OTP[]>;
    checkTrackingNumberAndUpdateStatus(trackingNumber: string, boxId: string): Promise<any>;
}
export default OTPModel;
