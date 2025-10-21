import { Navigate, Route, Routes } from "react-router";
import { DashboardComponent } from "../components/DashboardComponent";
import { AdminComponent } from "../components/AdminComponent";
import { ProtectedRouter } from "./ProtectedRouter";
import type { User } from "../types/user";
import { useEffect, useState } from "react";

export const AppRouter = () => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    setUser({
      id: 1,
      name: "John Doe",
      username: "johndoe",
      email: "",
      permissionLevel: [],
    });
  }, []);

  return (
    <Routes>
      <Route index element={<DashboardComponent />} />
      <Route path="/home" element={<DashboardComponent />} />
      <Route element={<ProtectedRouter isAllowed={!!user} />}>
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/admin" element={<AdminComponent />} />
      </Route>
      <Route
        path="/analytics"
        element={
          <ProtectedRouter
            isAllowed={!!user && user.permissionLevel.includes("ADMIN")}
            redirectTo="/about"
          >
            <h1>Analytics</h1>
          </ProtectedRouter>
        }
      />
      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
