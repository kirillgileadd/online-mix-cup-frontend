import { Avatar, Menu, Text } from "@mantine/core";
import {
  IconUser,
  IconLogout,
  IconUserCircle,
  IconUsers,
  IconTrophy,
  IconFileText,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useTransition } from "react";
import { logout } from "../../shared/api/auth";
import { AppCan } from "../../shared/authorization";
import { ROUTES } from "../../shared/routes";
import clsx from "clsx";
import type { Session } from "../../shared/session";
import { getPhotoUrl } from "../../shared/utils/photoUrl";

type UserAvatarMenuProps = {
  session: Session | null;
  className?: string;
};

export function UserAvatarMenu({ session, className }: UserAvatarMenuProps) {
  const navigate = useNavigate();
  const [isTransitioning, startTransition] = useTransition();

  const handleLogout = () =>
    startTransition(async () => {
      await logout();
      navigate("/login");
    });

  if (!session) {
    return null;
  }

  const displayName = session.username || "Пользователь";
  const avatarPhotoUrl = getPhotoUrl(session.photoUrl);

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <button
          className={clsx(
            "flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity",
            className
          )}
        >
          <Avatar
            size={40}
            radius={1000}
            src={avatarPhotoUrl}
            className="border-2 border-dark-600"
          >
            {!avatarPhotoUrl && (
              <IconUser size={20} className="text-gray-400" />
            )}
          </Avatar>
          <Text c="dark.0" size="sm" fw={500}>
            {displayName}
          </Text>
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          to={ROUTES.profile}
          leftSection={<IconUserCircle size={16} />}
        >
          Мой профиль
        </Menu.Item>
        <AppCan action={(permissions) => permissions.users.canManage()}>
          <Menu.Label>Админка</Menu.Label>
          <Menu.Item
            component={Link}
            to={ROUTES.adminUsers}
            leftSection={<IconUsers size={16} />}
          >
            Пользаки
          </Menu.Item>
          <Menu.Item
            component={Link}
            to={ROUTES.adminTournaments}
            leftSection={<IconTrophy size={16} />}
          >
            Турниры
          </Menu.Item>
          <Menu.Item
            component={Link}
            to={ROUTES.adminApplications}
            leftSection={<IconFileText size={16} />}
          >
            Заявки
          </Menu.Item>
          <Menu.Item
            component={Link}
            to={ROUTES.adminPlayers}
            leftSection={<IconPlayerPlay size={16} />}
          >
            Игроки
          </Menu.Item>
        </AppCan>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
          disabled={isTransitioning}
        >
          Выйти
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
