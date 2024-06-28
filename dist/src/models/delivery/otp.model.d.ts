import { OTP } from '../../types/otp.type';
declare class OTPModel {
    createOTP(otp: Partial<OTP>): Promise<OTP>;
    getMany(): Promise<OTP[]>;
    getOne(id: number): Promise<OTP>;
    updateOne(otp: Partial<OTP>, id: number): Promise<OTP>;
    deleteOne(id: number): Promise<OTP>;
}
export default OTPModel;
