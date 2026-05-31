import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import type { Pagination } from "../../types/Pagination";
import type { Role } from "../../types/Role";
import { useState } from "react";

// types.ts
export interface RolesFilters extends Pagination {
  search: string;
}

interface RolesResponse {
  data: Role[];
  meta: RolesFilters & {
    total: number;
    count: number;
  };
}

const fetchRoles = async (filters: RolesFilters): Promise<RolesResponse> => {
  try {
    const { data } = await axios.get(`/roles`, { params: filters });
    return data;
  } catch (error) {
    if (error) message.error("Failed to fetch roles");
    throw error;
  }
};

export const useGetRoles = (initialFilters: RolesFilters) => {
  const [filters, setFilters] = useState(initialFilters);

  const query = useQuery<RolesResponse>({
    queryKey: ["roles", ...Object.values(filters)],
    queryFn: () => fetchRoles(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return { ...query, setFilters, filters };
};
