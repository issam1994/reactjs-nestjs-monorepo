import type { User } from "../types/User";

type ResourceAction = "read" | "create" | "update" | "delete";

type ResourcePermissionMap = Record<ResourceAction, string>;

export type ResourceActionPermissions = {
  user: ResourcePermissionMap;
  permission: ResourcePermissionMap;
  role: ResourcePermissionMap;
  rolePermission: ResourcePermissionMap;
};

export const resourceActionPermissions: ResourceActionPermissions = {
  user: {
    read: "user:read",
    create: "user:create",
    update: "user:update",
    delete: "user:delete",
  },
  permission: {
    read: "permission:read",
    create: "permission:create",
    update: "permission:update",
    delete: "permission:delete",
  },
  role: {
    read: "role:read",
    create: "role:create",
    update: "role:update",
    delete: "role:delete",
  },
  rolePermission: {
    read: "role_permission:read",
    create: "role_permission:create",
    update: "role_permission:update",
    delete: "role_permission:delete",
  },
};

export const hasPermission = (
  user: User | null,
  requiredPermission: string = "",
): boolean => {
  // no user, no access
  if (!user) {
    return false;
  }
  // No specific permission required, allow access
  if (!requiredPermission) {
    return true;
  }
  const userPermissionsFlat = user.roles.flatMap((role) => role.permissions);
  const resource = requiredPermission.split(":")[0];
  const action = requiredPermission.split(":")[1];
  return userPermissionsFlat.some((permission) => {
    return permission.resource === resource && permission.action === action;
  });
};
