import { ActionIcon, Button, Menu, Title, Badge } from "@mantine/core";
import { modals } from "@mantine/modals";
import clsx from "clsx";
import { IconDots, IconTrash } from "@tabler/icons-react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { type FC, useMemo } from "react";
import { useGetUsers } from "../model/useGetUsers";
import { useGetRoles } from "../model/useGetRoles";
import { useCreateUserModal } from "./useCreateUserModal";
import { useUpdateUserModal } from "./useUpdateUserModal";
import { useDeleteUser } from "../model/useDeleteUser";
import { useReactTable } from "../../../shared/useReactTable";
import type { User } from "../../../entitity/User";

type UserRegistryPageProps = {
  className?: string;
};

export const UsersTable: FC<UserRegistryPageProps> = ({ className }) => {
  const createModal = useCreateUserModal();
  const updateModal = useUpdateUserModal();
  const deleteMutation = useDeleteUser();

  const usersQuery = useGetUsers();
  const rolesQuery = useGetRoles();

  const roleLabelsMap = useMemo(() => {
    if (!rolesQuery.data) return {};
    const map: Record<string, string> = {};
    rolesQuery.data.forEach((role) => {
      map[role.name] = role.description || role.name;
    });
    return map;
  }, [rolesQuery.data]);

  const handleDeleteUser = (user: User) => {
    modals.openConfirmModal({
      title: "Удалить пользователя",
      children: (
        <div>
          Вы уверены, что хотите удалить пользователя{" "}
          <strong>{user.username || user.telegramId}</strong>? Это действие
          нельзя отменить.
        </div>
      ),
      labels: { confirm: "Удалить", cancel: "Отмена" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteMutation.mutate(user.id);
      },
    });
  };

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "telegramId",
        header: "Telegram ID",
        sortingFn: "alphanumeric",
        filterFn: "contains",
      },
      {
        accessorKey: "username",
        header: "Username",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ cell }) => <>{cell.getValue() || "-"}</>,
      },
      {
        accessorKey: "nickname",
        header: "Никнейм",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ cell }) => <>{cell.getValue() || "-"}</>,
      },
      {
        accessorKey: "discordUsername",
        header: "Discord Username",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ cell }) => <>{cell.getValue() || "-"}</>,
      },
      {
        accessorKey: "steamId64",
        header: "Steam ID64",
        sortingFn: "alphanumeric",
        filterFn: "contains",
        Cell: ({ cell }) => <>{cell.getValue() || "-"}</>,
      },
      {
        id: "roles",
        accessorFn: (row) => row.roles.join(", "),
        header: "Роли",
        filterFn: "contains",
        enableColumnActions: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <div className="flex gap-2 flex-wrap">
            {cell.row.original.roles.map((role) => (
              <Badge key={role} variant="light">
                {roleLabelsMap[role] || role}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Дата создания",
        sortingFn: "datetime",
        filterFn: "contains",
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue() as string);
          return date.toLocaleDateString("ru-RU");
        },
      },
    ],
    [roleLabelsMap]
  );

  const table = useReactTable({
    columns,
    data: usersQuery?.data ?? [],
    renderRowActions: ({ row }) => (
      <Menu>
        <Menu.Target>
          <ActionIcon variant="light">
            <IconDots size={16} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => updateModal.updateUser(row.original.id)}>
            Обновить пользователя
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={() => handleDeleteUser(row.original)}
          >
            Удалить пользователя
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    ),
    enableRowActions: true,
    enableColumnOrdering: false,
    state: {
      isLoading: usersQuery.isLoading,
    },
    defaultColumn: {
      minSize: 20,
      maxSize: 200,
      size: 100,
    },
    enableColumnFilters: true,
    enableTopToolbar: true,
    enableGlobalFilter: true,
  });

  return (
    <>
      <div className={clsx("", className)}>
        <div className="flex gap-4 justify-between mb-6">
          <Title size="h1">Реестр пользователей</Title>
          <Button size="sm" onClick={createModal.createUser}>
            Создать пользователя
          </Button>
        </div>
        <MantineReactTable table={table} />
      </div>
      {createModal.modal}
      {updateModal.modal}
    </>
  );
};
