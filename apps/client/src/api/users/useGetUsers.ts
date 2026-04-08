import { useQuery } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";
import type { Pagination } from "../../types/Pagination";
import type { User } from "../../types/User";

// types.ts
export interface UsersFilters extends Pagination {
  search: string;
}

interface UsersResponse {
  data: User[];
  meta: UsersFilters;
}

const fetchUsers = async (filters: UsersFilters): Promise<UsersResponse> => {
  try {
    const { data } = await axios.get(`/users`, { params: filters });
    return data;
  } catch (error) {
    if (error) message.error("Failed to fetch users");
    throw error;
  }
};

export const useGetUsers = (filters: UsersFilters) => {
  const query = useQuery<UsersResponse>({
    queryKey: ["users", ...Object.values(filters)],
    queryFn: () => fetchUsers(filters),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return query;
};
