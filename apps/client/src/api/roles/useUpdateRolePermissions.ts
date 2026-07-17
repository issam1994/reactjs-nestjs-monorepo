import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

interface UpdateRolePermissionsArgs {
  roleId: string;
  permissionIds: string[];
}

const updateRolePermissions = async ({
  roleId,
  permissionIds,
}: UpdateRolePermissionsArgs) => {
  const { data } = await axios.put(`/roles/${roleId}/permissions`, {
    permissions: permissionIds,
  });
  return data;
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRolePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: () => {
      message.error("Failed to update permissions");
    },
  });
};
