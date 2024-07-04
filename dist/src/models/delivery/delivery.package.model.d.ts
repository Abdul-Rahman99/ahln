import { DeliveryPackage } from '../../types/delivery.package.type';
declare class DeliveryPackageModel {
    generateCustomId(userId: string): Promise<string>;
    createDeliveryPackage(userId: string, deliveryPackage: Partial<DeliveryPackage>): Promise<DeliveryPackage>;
    getMany(): Promise<DeliveryPackage[]>;
    getOne(id: string): Promise<DeliveryPackage>;
    updateOne(deliveryPackage: Partial<DeliveryPackage>, id: string): Promise<DeliveryPackage>;
    deleteOne(id: string): Promise<DeliveryPackage>;
    getPackagesByUser(userId: string, shipment_status: string): Promise<DeliveryPackage[]>;
}
export default DeliveryPackageModel;
