import { BoxImage } from '../../types/box.image.type';
export default class BoxImageModel {
    createBoxImage(boxId: string, deliveryPackageId: string, imageName: string): Promise<BoxImage>;
    getAllBoxImages(boxId: string): Promise<BoxImage[]>;
    getBoxImagesByBoxId(boxId: string): Promise<BoxImage[]>;
    getBoxImagesByPackageId(packageId: string): Promise<BoxImage[]>;
}
