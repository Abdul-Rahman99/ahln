import { BoxImage } from '../../types/box.image.type';
declare class BoxImageModel {
    createBoxImage(boxImage: Partial<BoxImage>): Promise<BoxImage>;
    getMany({ date, deliveryPackageId, boxId, }: {
        date?: string;
        deliveryPackageId?: number;
        boxId?: string;
    }): Promise<BoxImage[]>;
    getOne({ id, date, deliveryPackageId, boxId, }: {
        id: number;
        date?: string;
        deliveryPackageId?: number;
        boxId?: string;
    }): Promise<BoxImage>;
    updateOne(boxImage: Partial<BoxImage>, id: number): Promise<BoxImage>;
    deleteOne(id: number): Promise<BoxImage>;
}
export default BoxImageModel;
