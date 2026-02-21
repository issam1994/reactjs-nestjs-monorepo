import { Table, Spin, Alert, Button, Space, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const fetchUsers = async (): Promise<User[] | undefined> => {
  try {
    const { data } = await axios.get("/users");
    return data;
  } catch (error) {
    if (error) message.error("Failed to fetch users");
  }
};

const UsersPage: React.FC = () => {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (error) {
    return <Alert message="Error" description={error.message} type="error" />;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        <h1>Users</h1>
        <Button onClick={() => refetch()} loading={isLoading}>
          Refresh
        </Button>
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={pagination}
            onChange={(pag) => setPagination(pag)}
          />
        </Spin>
      </Space>
    </div>
  );
};

export default UsersPage;
