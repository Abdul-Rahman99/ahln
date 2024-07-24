import { Address } from '../../types/address.type';
declare class AddressModel {
    createAddress(address: Partial<Address>, user: string): Promise<Address>;
    getMany(): Promise<Address[]>;
    getOne(id: number, user: string): Promise<Address>;
    updateOne(address: Partial<Address>, id: number, user: string): Promise<Address>;
    deleteOne(id: number, user: string): Promise<Address>;
}
export default AddressModel;
