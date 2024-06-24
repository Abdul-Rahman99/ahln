import { Permission } from '../../types/permission.type';
declare class UserPermissionModel {
    assignPermission(userId: string, permissionId: number): Promise<void>;
    revokePermission(userId: string, permissionId: number): Promise<void>;
    getPermissionsByUser(userId: string): Promise<Permission[]>;
    checkPermissionAssignment(user_id: string, permission_id: number): Promise<boolean>;
}
export default UserPermissionModel;
