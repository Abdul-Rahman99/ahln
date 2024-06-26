import { Address } from '../../types/address.type';
declare class AddressModel {
    createAddress(address: Partial<Address>): Promise<Address>;
    getMany(): Promise<Address[]>;
    getOne(id: number): Promise<Address>;
    updateOne(address: Partial<Address>, id: number): Promise<Address>;
    deleteOne(id: number): Promise<Address>;
}
export default AddressModel;
