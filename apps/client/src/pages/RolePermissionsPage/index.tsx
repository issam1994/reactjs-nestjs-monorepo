import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Empty,
  List,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { CloseOutlined, KeyOutlined, SaveOutlined } from "@ant-design/icons";
import { useGetAllRoles } from "../../api/roles/useGetAllRoles";
import { useGetAllPermissions } from "../../api/permissions/useGetAllPermissions";
import { useUpdateRolePermissions } from "../../api/roles/useUpdateRolePermissions";
import type { Permission } from "../../types/Permission";

type MatrixRow = { resource: string };

const ACTIONS_ORDER = ["create", "read", "update", "delete"];

const RolePermissionsPage: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [originalIds, setOriginalIds] = useState<Set<string>>(new Set());

  const { data: roles, isLoading: rolesLoading } = useGetAllRoles();
  const { data: allPermissions, isLoading: permsLoading } =
    useGetAllPermissions();
  const updateMutation = useUpdateRolePermissions();

  const selectedRole = useMemo(
    () => roles?.find((r) => String(r.id) === selectedRoleId),
    [roles, selectedRoleId],
  );

  // Build resource → action → permission lookup
  const matrix = useMemo(() => {
    const m: Record<string, Record<string, Permission>> = {};
    allPermissions?.forEach((p) => {
      if (!m[p.resource]) m[p.resource] = {};
      m[p.resource][p.action] = p;
    });
    return m;
  }, [allPermissions]);

  const resources = useMemo(() => Object.keys(matrix).sort(), [matrix]);

  const actions = useMemo(() => {
    const found = [...new Set(allPermissions?.map((p) => p.action) ?? [])];
    return ACTIONS_ORDER.filter((a) => found.includes(a));
  }, [allPermissions]);

  const hasChanges = useMemo(() => {
    if (checkedIds.size !== originalIds.size) return true;
    for (const id of checkedIds) {
      if (!originalIds.has(id)) return true;
    }
    return false;
  }, [checkedIds, originalIds]);

  const changeCount = useMemo(() => {
    let count = 0;
    for (const id of checkedIds) if (!originalIds.has(id)) count++;
    for (const id of originalIds) if (!checkedIds.has(id)) count++;
    return count;
  }, [checkedIds, originalIds]);

  const switchToRole = (roleId: string) => {
    const role = roles?.find((r) => String(r.id) === roleId);
    const ids = new Set((role?.permissions ?? []).map((p) => String(p.id)));
    setSelectedRoleId(roleId);
    setCheckedIds(new Set(ids));
    setOriginalIds(new Set(ids));
  };

  const handleRoleSelect = (roleId: string) => {
    if (roleId === selectedRoleId) return;
    if (hasChanges) {
      Modal.confirm({
        title: "Unsaved changes",
        content: "Switch role and discard your unsaved changes?",
        okText: "Discard & switch",
        cancelText: "Stay",
        onOk: () => switchToRole(roleId),
      });
    } else {
      switchToRole(roleId);
    }
  };

  const handleToggle = (permissionId: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(permissionId);
      else next.delete(permissionId);
      return next;
    });
  };

  const handleToggleResource = (resource: string, checked: boolean) => {
    const resourcePerms = Object.values(matrix[resource] ?? {});
    setCheckedIds((prev) => {
      const next = new Set(prev);
      resourcePerms.forEach((p) => {
        const id = String(p.id);
        if (checked) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    try {
      await updateMutation.mutateAsync({
        roleId: selectedRoleId,
        permissionIds: [...checkedIds],
      });
      setOriginalIds(new Set(checkedIds));
      message.success("Permissions saved successfully");
    } catch {
      // error shown by mutation's onError
    }
  };

  const handleDiscard = () => {
    setCheckedIds(new Set(originalIds));
  };

  const tableData: MatrixRow[] = resources.map((resource) => ({ resource }));

  const columns: ColumnsType<MatrixRow> = [
    {
      title: "Resource",
      dataIndex: "resource",
      width: 160,
      render: (resource: string) => {
        const resourcePerms = Object.values(matrix[resource] ?? {});
        const checkedCount = resourcePerms.filter((p) =>
          checkedIds.has(String(p.id)),
        ).length;
        const allChecked = checkedCount === resourcePerms.length;
        const indeterminate = checkedCount > 0 && !allChecked;
        return (
          <Space>
            <Checkbox
              checked={allChecked}
              indeterminate={indeterminate}
              disabled={!selectedRole || updateMutation.isPending}
              onChange={(e) => handleToggleResource(resource, e.target.checked)}
            />
            <Tag
              color="geekblue"
              style={{ textTransform: "capitalize", margin: 0 }}
            >
              {resource}
            </Tag>
          </Space>
        );
      },
    },
    ...actions.map((action) => ({
      title: (
        <span style={{ textTransform: "capitalize" as const }}>{action}</span>
      ),
      key: action,
      align: "center" as const,
      width: 100,
      render: ({ resource }: MatrixRow) => {
        const permission = matrix[resource]?.[action];
        if (!permission) {
          return <span style={{ color: "#d9d9d9" }}>—</span>;
        }
        const permId = String(permission.id);
        const isChecked = checkedIds.has(permId);
        const wasChecked = originalIds.has(permId);
        const isAdded = isChecked && !wasChecked;
        const isRemoved = !isChecked && wasChecked;

        let cellBg = "transparent";
        if (isAdded) cellBg = "#f6ffed";
        if (isRemoved) cellBg = "#fff2f0";

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              borderRadius: 4,
              padding: "4px 0",
              background: cellBg,
              transition: "background 0.2s",
            }}
          >
            <Checkbox
              checked={isChecked}
              disabled={!selectedRole || updateMutation.isPending}
              onChange={(e) => handleToggle(permId, e.target.checked)}
            />
          </div>
        );
      },
    })),
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Typography.Title level={2}>
        <KeyOutlined style={{ marginRight: 8 }} />
        Role Permissions
      </Typography.Title>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Left: roles list */}
        <Card
          title="Roles"
          style={{ width: 256, flexShrink: 0 }}
          styles={{ body: { padding: 0 } }}
        >
          <Spin spinning={rolesLoading}>
            <List
              dataSource={roles ?? []}
              locale={{ emptyText: "No roles found" }}
              renderItem={(role) => {
                const isSelected = String(role.id) === selectedRoleId;
                const permCount = role.permissions?.length ?? 0;
                return (
                  <List.Item
                    onClick={() => handleRoleSelect(String(role.id))}
                    style={{
                      cursor: "pointer",
                      padding: "10px 16px",
                      background: isSelected ? "#e6f4ff" : undefined,
                      borderLeft: isSelected
                        ? "3px solid #1677ff"
                        : "3px solid transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <List.Item.Meta
                      title={
                        <span
                          style={{
                            fontWeight: isSelected ? 600 : 400,
                            textTransform: "capitalize",
                          }}
                        >
                          {role.name}
                        </span>
                      }
                      description={
                        <Space size={4}>
                          <Badge
                            count={permCount}
                            color={permCount === 0 ? "default" : "blue"}
                            showZero
                          />
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: 11 }}
                          >
                            {permCount === 1 ? "permission" : "permissions"}
                          </Typography.Text>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Spin>
        </Card>

        {/* Right: permission matrix */}
        <Card
          style={{ flex: 1 }}
          title={
            selectedRole ? (
              <Space wrap>
                <span>Permissions for</span>
                <Tag color="blue" style={{ textTransform: "capitalize" }}>
                  {selectedRole.name}
                </Tag>
                {hasChanges && (
                  <Tag color="orange">
                    {changeCount} unsaved change
                    {changeCount !== 1 ? "s" : ""}
                  </Tag>
                )}
              </Space>
            ) : (
              "Select a role"
            )
          }
          extra={
            hasChanges ? (
              <Space>
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleDiscard}
                  disabled={updateMutation.isPending}
                >
                  Discard
                </Button>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={updateMutation.isPending}
                >
                  Save
                </Button>
              </Space>
            ) : null
          }
        >
          {!selectedRole ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Select a role from the left panel to manage its permissions"
            />
          ) : (
            <Spin spinning={permsLoading}>
              <Table
                dataSource={tableData}
                columns={columns}
                rowKey="resource"
                pagination={false}
                size="middle"
                bordered
              />
              <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
                <Space size={4}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      background: "#f6ffed",
                      border: "1px solid #b7eb8f",
                      borderRadius: 2,
                    }}
                  />
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Newly granted
                  </Typography.Text>
                </Space>
                <Space size={4}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      background: "#fff2f0",
                      border: "1px solid #ffccc7",
                      borderRadius: 2,
                    }}
                  />
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Newly revoked
                  </Typography.Text>
                </Space>
              </div>
            </Spin>
          )}
        </Card>
      </div>
    </Space>
  );
};

export default RolePermissionsPage;
