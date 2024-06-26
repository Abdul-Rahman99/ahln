import { OTP } from '../../types/otp.type';
declare class OTPModel {
    createOTP(otpData: Partial<OTP>): Promise<OTP>;
    checkOTP(otp: string, deliveryPackageId: string): Promise<OTP | null>;
    getMany(): Promise<OTP[]>;
    getOne(id: number): Promise<OTP>;
    updateOne(otp: Partial<OTP>, id: number): Promise<OTP>;
    deleteOne(id: number): Promise<OTP>;
    getOTPsByUser(userId: string): Promise<OTP[]>;
    checkTrackingNumberAndUpdateStatus(trackingNumber: string): Promise<string>;
}
export default OTPModel;
