import { User } from '../../types/user.type';
declare class UserModel {
    createUser(u: Partial<User>): Promise<User>;
    getMany(): Promise<User[]>;
    getOne(id: string): Promise<User>;
    updateUser(email: string, updateFields: Partial<User>): Promise<User>;
    updateOne(u: Partial<User>, id: string): Promise<User>;
    deleteOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    emailExists(email: string): Promise<boolean>;
    phoneExists(phone: string): Promise<boolean>;
    updateOtpHash(userId: string, otpHash: string, otpExpiration: Date): Promise<void>;
    saveOtp(email: string, otp: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    updateUserPassword(email: string, newPassword: string): Promise<void>;
    checkResetPasswordOTP(email: string, otp: string): Promise<boolean>;
    updateResetPasswordOTP(email: string, otp: string | null): Promise<void>;
}
export default UserModel;
