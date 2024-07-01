import { ShippingCompany } from '../../types/shipping.company.type';
export default class ShippingCompanyModel {
    createShippingCompany(trackingSystem: string, title: string, logo: string): Promise<ShippingCompany>;
    getAllShippingCompanies(): Promise<ShippingCompany[]>;
    getShippingCompanyById(id: number): Promise<ShippingCompany | null>;
    updateShippingCompany(id: number, trackingSystem: string, title: string, logo: string): Promise<ShippingCompany>;
    deleteShippingCompany(id: number): Promise<void>;
}
