import { Role } from 'src/types/role.type';
declare class RoleModel {
    create(title: string, description: string): Promise<Role>;
    getAll(): Promise<Role[]>;
    getById(id: number): Promise<Role>;
    update(id: number, title: string, description: string): Promise<Role>;
    delete(id: number): Promise<Role>;
}
export default RoleModel;
