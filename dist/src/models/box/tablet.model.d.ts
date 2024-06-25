import { Tablet } from '../../types/tablet.type';
declare class TabletModel {
    generateTabletId(): Promise<string>;
    createTablet(t: Partial<Tablet>): Promise<Tablet>;
    getMany(): Promise<Tablet[]>;
    getOne(id: string): Promise<Tablet>;
    updateOne(t: Partial<Tablet>, id: string): Promise<Tablet>;
    deleteOne(id: string): Promise<Tablet>;
    serialNumberExists(serial_number: string): Promise<boolean>;
    androidIdExists(android_id: string): Promise<boolean>;
}
export default TabletModel;
