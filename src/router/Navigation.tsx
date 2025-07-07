import { useRoutes, Navigate } from "react-router-dom";
import MainLayout from "@/Pages/Super_User/MainLayout/MainLayout";
import HomePage from "@/Pages/Super_User/HomePage/Home_page";
import LoginPage from "@/Pages/Super_User/LogIn/LogIn_page";
import { UserManagement } from "@/Pages/Super_User/UserManagement/UserManagementPage";
import { ProyectManagementPage } from "@/Pages/Super_User/ProyectManagement/ProyectManagementPage";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const Navigation = () => {

  const { initializeAuth, isAuthenticated} = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const routes = useRoutes(
    isAuthenticated
      ? [
          {
            path: "/",
            element: <MainLayout />,
            children: [
              { path: "home", element: <HomePage /> },
              { path: "UserManagement", element: <UserManagement /> },
              { path: "ProyectManagement", element: <ProyectManagementPage /> },
              { path: "*", element: <Navigate to="/home" replace /> },
            ],
          },
          { path: "/login", element: <Navigate to="/home" replace /> },
        ]
      : [
          { path: "/login", element: <LoginPage /> },
          { path: "*", element: <Navigate to="/login" replace /> },
        ]
  );

  return routes;
};

export default Navigation;
