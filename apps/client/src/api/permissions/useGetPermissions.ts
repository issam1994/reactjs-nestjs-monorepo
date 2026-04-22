import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import type { Pagination } from "../../types/Pagination";
import type { Permission } from "../../types/Permission";
import { useState } from "react";

// types.ts
export interface PermissionsFilters extends Pagination {
  search: string;
}

interface PermissionsResponse {
  data: Permission[];
  meta: PermissionsFilters & {
    total: number;
    count: number;
  };
}

const fetchPermissions = async (
  filters: PermissionsFilters,
): Promise<PermissionsResponse> => {
  try {
    const { data } = await axios.get(`/permissions`, { params: filters });
    return data;
  } catch (error) {
    if (error) message.error("Failed to fetch permissions");
    throw error;
  }
};

export const useGetPermissions = (initialFilters: PermissionsFilters) => {
  const [filters, setFilters] = useState(initialFilters);

  const query = useQuery<PermissionsResponse>({
    queryKey: ["permissions", ...Object.values(filters)],
    queryFn: () => fetchPermissions(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return { ...query, setFilters, filters };
};
