import { Box } from '../../types/box.type';
import { UserBox } from '../../types/user.box.type';
import { Address } from '../../types/address.type';
declare class UserBoxModel {
    createUserBox(userBox: Partial<UserBox>): Promise<UserBox>;
    getAllUserBoxes(): Promise<(UserBox & Box)[]>;
    checkUserBoxExists(userBoxId: string): Promise<boolean>;
    getUserBoxesByUserId(userId: string): Promise<(UserBox & Box & Address)[]>;
    assignBoxToUser(userId: string, boxId: string): Promise<UserBox>;
    getOne(id: string): Promise<UserBox>;
    updateOne(userBox: Partial<UserBox>, id: string): Promise<UserBox>;
    deleteOne(id: string): Promise<UserBox>;
    getUserBoxesByBoxId(boxId: string): Promise<UserBox[]>;
    userAssignBoxToHimslef(userId: string, serialNumber: string, addressId: number): Promise<UserBox>;
    checkUserBox(user: string, boxId: string): Promise<boolean>;
    assignRelativeUser(userId: string, boxId: string, email: string): Promise<UserBox>;
    updateUserBoxStatus(is_active: boolean, id: string): Promise<boolean>;
}
export default UserBoxModel;
