import { Navigate, Outlet } from "react-router";
import type { ReactNode } from "react";

interface ProtectedRouterProps {
  isAllowed: boolean;
  children?: ReactNode;
  redirectTo?: string;
}

export const ProtectedRouter = ({
  isAllowed,
  children,
  redirectTo = "/home",
}: ProtectedRouterProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }

  return children ? children : <Outlet />;
};
