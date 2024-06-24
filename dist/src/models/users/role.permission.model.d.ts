import { Permission } from '../../types/permission.type';
declare class RolePermissionModel {
    assignPermission(roleId: number, permissionId: number): Promise<void>;
    revokePermission(roleId: number, permissionId: number): Promise<void>;
    getPermissionsByRole(roleId: number): Promise<Permission[]>;
    checkPermissionAssignment(role_id: number, permission_id: number): Promise<boolean>;
}
export default RolePermissionModel;
