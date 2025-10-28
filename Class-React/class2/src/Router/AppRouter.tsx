import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRouter } from "./ProtectedRouter";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ProductsPage from "../pages/ProductsPage";
import AdminPage from "../pages/AdminPage";

const mockUser = {
  id: 1,
  name: "John Doe",
  role: "USER",
  isLoggedIn: true,
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          mockUser.isLoggedIn ? <Navigate to="/home" replace /> : <LoginPage />
        }
      />

      <Route
        element={
          <ProtectedRouter
            isAllowed={mockUser.isLoggedIn}
            redirectTo="/login"
          />
        }
      >
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRouter
            isAllowed={mockUser.isLoggedIn && mockUser.role === "ADMIN"}
            redirectTo="/home"
          >
            <AdminPage />
          </ProtectedRouter>
        }
      />

      <Route
        path="/"
        element={
          <Navigate to={mockUser.isLoggedIn ? "/home" : "/login"} replace />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={mockUser.isLoggedIn ? "/home" : "/login"} replace />
        }
      />
    </Routes>
  );
};
