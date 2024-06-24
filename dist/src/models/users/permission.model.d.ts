import { Permission } from '../../types/permission.type';
declare class PermissionModel {
    create(title: string, description: string): Promise<Permission>;
    getAll(): Promise<Permission[]>;
    getById(id: number): Promise<Permission>;
    update(id: number, title: string, description: string): Promise<Permission>;
    delete(id: number): Promise<Permission>;
}
export default PermissionModel;
