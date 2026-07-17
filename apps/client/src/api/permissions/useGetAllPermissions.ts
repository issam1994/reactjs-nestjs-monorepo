import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import type { Permission } from "../../types/Permission";

const fetchAllPermissions = async (): Promise<Permission[]> => {
  try {
    const { data } = await axios.get("/permissions", {
      params: { page: 1, take: 100 },
    });
    return data.data;
  } catch (error) {
    if (error) message.error("Failed to fetch permissions");
    throw error;
  }
};

export const useGetAllPermissions = () => {
  return useQuery<Permission[]>({
    queryKey: ["permissions", "all"],
    queryFn: fetchAllPermissions,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};
