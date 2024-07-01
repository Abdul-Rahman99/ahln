import { Box } from '../../types/box.type';
import { UserBox } from '../../types/user.box.type';
declare class UserBoxModel {
    createUserBox(userBox: Partial<UserBox>): Promise<UserBox>;
    getAllUserBoxes(): Promise<(UserBox & Box)[]>;
    getUserBoxesByUserId(userId: string): Promise<(UserBox & Box)[]>;
    assignBoxToUser(userId: string, boxId: string): Promise<UserBox>;
    getOne(id: string): Promise<UserBox>;
    updateOne(userBox: Partial<UserBox>, id: string): Promise<UserBox>;
    deleteOne(id: string): Promise<UserBox>;
    getUserBoxesByBoxId(boxId: string): Promise<UserBox[]>;
}
export default UserBoxModel;
