import { BoxImage } from '../../types/box.image.type';
declare class BoxImageModel {
    createBoxImage(boxImage: Partial<BoxImage>): Promise<BoxImage>;
    getMany(): Promise<BoxImage[]>;
    getOne(id: number): Promise<BoxImage>;
    updateOne(boxImage: Partial<BoxImage>, id: number): Promise<BoxImage>;
    deleteOne(id: number): Promise<BoxImage>;
}
export default BoxImageModel;
