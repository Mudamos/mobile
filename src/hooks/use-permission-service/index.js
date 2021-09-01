import { useMemo } from "react";
import PermissionService, {
  AUTHORIZED,
  DENIED,
} from "../../services/permission";

const permissionService = PermissionService();

export const usePermissionService = () => {
  return useMemo(
    () => ({
      permissionService,
      STATUSES: {
        AUTHORIZED,
        DENIED,
      },
    }),
    [],
  );
};
