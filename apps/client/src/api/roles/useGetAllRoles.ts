import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import type { Role } from "../../types/Role";

const fetchAllRoles = async (): Promise<Role[]> => {
  try {
    const { data } = await axios.get("/roles/all");
    return data;
  } catch (error) {
    if (error) message.error("Failed to fetch roles");
    throw error;
  }
};

export const useGetAllRoles = () => {
  return useQuery<Role[]>({
    queryKey: ["roles", "all"],
    queryFn: fetchAllRoles,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
