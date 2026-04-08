import { Table, Spin, Alert, Space, Typography, Card, Tag, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { User } from "../../types/User";
import { useGetUsers } from "../../api/users/useGetUsers";
import { useState } from "react";

const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    take: 5,
    search: "",
  });
  const { data, isLoading, error } = useGetUsers(filters);
  const columns: ColumnsType<User> = [
    {
      title: "Full Name",
      key: "id",
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <Tag color={"green"}>{email}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (error) {
    return <Alert message="Error" description={error.message} type="error" />;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        <Typography.Title level={2}>Users</Typography.Title>
        <Card size="small">
          <Input
            className="max-w-xs"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilters({
                ...filters,
                search: e.target.value,
                page: 1,
              })
            }
            style={{ marginBottom: "16px" }}
          />
          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={data?.data}
              rowKey="id"
              pagination={{
                current: data?.meta?.page,
                pageSize: data?.meta?.take,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20", "50"],
              }}
              onChange={(pag) =>
                setFilters({
                  ...filters,
                  page: pag.current || 1,
                  take: pag.pageSize || 5,
                })
              }
            />
          </Spin>
        </Card>
      </Space>
    </div>
  );
};

export default UsersPage;
