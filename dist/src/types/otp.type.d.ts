export interface OTP {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    box_id: string;
    box_locker_id: string;
    is_used: boolean;
}
