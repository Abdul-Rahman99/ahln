import { BoxLocker } from '../../types/box.locker.type';
declare class BoxLockerModel {
    createBoxLocker(boxLocker: Partial<BoxLocker>): Promise<BoxLocker>;
    getMany(): Promise<BoxLocker[]>;
    getOne(id: string): Promise<BoxLocker>;
    updateOne(boxLocker: Partial<BoxLocker>, id: string): Promise<BoxLocker>;
    deleteOne(id: string): Promise<BoxLocker>;
    getAllLockersById(boxId: string): Promise<BoxLocker[]>;
}
export default BoxLockerModel;
