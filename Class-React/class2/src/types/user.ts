export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  permissionLevel: PermissionLevel[];
}

export type PermissionLevel = "ADMIN" | "USER" | "GUEST";
