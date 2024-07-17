import { DeliveryPackage } from '../../types/delivery.package.type';
declare class DeliveryPackageModel {
    generateCustomId(userId: string): Promise<string>;
    createDeliveryPackage(userId: string, deliveryPackage: Partial<DeliveryPackage>): Promise<DeliveryPackage>;
    getMany(): Promise<DeliveryPackage[]>;
    getOne(id: string): Promise<DeliveryPackage>;
    checkTrackingNumber(tracking_number: string): Promise<any>;
    updateOne(deliveryPackage: Partial<DeliveryPackage>, id: string, user: string): Promise<DeliveryPackage>;
    deleteOne(id: string, user: string): Promise<DeliveryPackage>;
    getPackagesByUser(userId: string, status: any): Promise<DeliveryPackage[]>;
    getUserByDeliveryPackageId(id: string): Promise<string>;
}
export default DeliveryPackageModel;
