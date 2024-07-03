import { BoxImage } from '../../types/box.image.type';
export default class BoxImageModel {
    createBoxImage(boxId: string, deliveryPackageId: string, imageName: string): Promise<BoxImage>;
    getAllBoxImages(): Promise<BoxImage[]>;
    getBoxImageById(id: number): Promise<BoxImage | null>;
    updateBoxImage(id: number, boxId: string, deliveryPackageId: string, imageName: string): Promise<BoxImage>;
    deleteBoxImage(id: number): Promise<void>;
    getBoxImagesByUser(userId: string): Promise<BoxImage[]>;
    getBoxImagesByBoxId(boxId: string): Promise<BoxImage[]>;
    getBoxImagesByPackageId(packageId: string): Promise<BoxImage[]>;
}
