import { BoxLocker } from '../../types/box.locker.type';
declare class BoxLockerModel {
    createBoxLocker(boxLocker: Partial<BoxLocker>): Promise<BoxLocker>;
    getMany(): Promise<BoxLocker[]>;
    getOne(id: number): Promise<BoxLocker>;
    updateOne(boxLocker: Partial<BoxLocker>, id: number): Promise<BoxLocker>;
    deleteOne(id: number): Promise<BoxLocker>;
}
export default BoxLockerModel;
