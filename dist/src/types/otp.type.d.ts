export interface OTP {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    box_id: string;
    box_locker_id: string;
    is_used: boolean;
    otp: string | null;
    box_locker_string: string;
    delivery_package_id: string;
}
