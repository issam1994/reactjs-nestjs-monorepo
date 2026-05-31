import {
  Table,
  Spin,
  Alert,
  Space,
  Typography,
  Card,
  Input,
  Form,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Role } from "../../types/Role";
import { useGetRoles } from "../../api/roles/useGetRoles";

interface RolesTableProps {
  [key: string]: unknown;
}

const RolesTable: React.FC<RolesTableProps> = () => {
  const { data, isLoading, error, filters, setFilters } = useGetRoles({
    page: 1,
    take: 5,
    search: "",
  });

  const [form] = Form.useForm();

  const handleFilterFormSubmit = (values: { search: string }) => {
    setFilters((filters) => ({
      ...filters,
      search: values.search,
      page: 1,
    }));
  };

  const columns: ColumnsType<Role> = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "permissions",
      dataIndex: "permissions",
      key: "permissions",
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
    <Space orientation="vertical" style={{ width: "100%" }} size="large">
      <Typography.Title level={2}>Roles</Typography.Title>
      <Card>
        <Form
          initialValues={filters}
          form={form}
          layout="inline"
          className="mb-4!"
          onFinish={handleFilterFormSubmit}
        >
          <Form.Item name={"search"} label="Search">
            <Input
              placeholder="Search by name or description"
              style={{ width: 300 }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Apply
          </Button>
        </Form>
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
              total: data?.meta?.total,
              onChange: (page, take) =>
                setFilters({
                  ...filters,
                  page: page,
                  take: take,
                }),
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
  );
};

export default RolesTable;
