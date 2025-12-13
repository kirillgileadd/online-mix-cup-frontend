import { createContext, type ReactNode, useContext } from "react";
import { appSessionStore } from "./session";
import { UserRole } from "./types.ts";

type AppPermissions = {
  users: {
    canView: () => boolean;
    canManage: (userId?: number) => boolean;
  };
};

export function useRole() {
  const session = appSessionStore.useSession();

  return session?.roles;
}

// eslint-disable-next-line react-refresh/only-export-components
export const createAdminPermissions = (): AppPermissions => ({
  users: {
    canView: () => true,
    canManage: () => true,
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const createUserPermissions = (
  session: { userId: number; roles: string[] } | null
): AppPermissions => ({
  users: {
    canView: () => false,
    canManage: (userId?: number) => {
      if (!session) return false;
      // Если передан userId и он совпадает с userId в токене, и есть роль player
      if (userId !== undefined && userId === session.userId) {
        return session.roles.includes(UserRole.PLAYER);
      }
      return false;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const defaultPermissions: AppPermissions = {
  users: {
    canView: () => false,
    canManage: () => false,
  },
};

// Update permissions logic to handle multiple roles
const createPermissionsFromRoles = (
  session: { userId: number; roles: string[] } | null
): AppPermissions => {
  if (!session) {
    return defaultPermissions;
  }

  const has = (r: string) => session.roles.includes(r);

  if (has(UserRole.ADMIN)) {
    return createAdminPermissions();
  }

  if (has(UserRole.PLAYER)) {
    return createUserPermissions(session);
  }

  return defaultPermissions;
};

function usePermissions(): AppPermissions {
  const session = appSessionStore.useSession();
  return createPermissionsFromRoles(session);
}

const appPermissionsContext = createContext<AppPermissions>(defaultPermissions);
export const AppPermissionsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const permissions = usePermissions();
  return (
    <appPermissionsContext.Provider value={permissions}>
      {children}
    </appPermissionsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppPermissions = () => {
  return useContext(appPermissionsContext);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export function AppCan({
  action,
  children,
  not,
  def = null,
}: {
  action: (permissions: AppPermissions) => boolean;
  children: React.ReactNode;
  not?: boolean;
  def?: React.ReactElement | null;
}): React.ReactElement | null {
  const permissions = useAppPermissions();
  const can = action(permissions);
  if (!not && !can) {
    return def;
  }

  if (not && can) {
    return def;
  }

  return <>{children}</>;
}
