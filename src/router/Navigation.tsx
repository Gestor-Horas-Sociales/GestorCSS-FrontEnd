"use client";

import { useRoutes, Navigate } from "react-router-dom";
import MainLayout from "@/Pages/MainLayout/MainLayout";
import LoginPage from "@/Pages/Auth/LoginPage";
import DashboardPage from "@/Pages/Dashboard/DashboardPage";
import UsersPage from "@/Pages/User/StudentsPage";
import ProjectsPage from "@/Pages/Projects/ProjectsPage";
import HoursPage from "@/Pages/Hours/HoursPage";
import ReportsPage from "@/Pages/Reports/ReportsPage";
import SettingsPage from "@/Pages/Settings/SettingsPage";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import Institutions from "@/Pages/Institutions/Institutions";
import Spinner from "@/components/Spinner";

const Navigation = () => {
  const { initializeAuth, isAuthenticated, isLoading } = useAuthStore();

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
              { index: true, element: <Navigate to="/dashboard" replace /> },
              { path: "dashboard", element: <DashboardPage /> },
              { path: "users/*", element: <UsersPage /> },
              { path: "institutions/*", element: <Institutions /> },
              { path: "projects/*", element: <ProjectsPage /> },
              { path: "hours/*", element: <HoursPage /> },
              { path: "reports/*", element: <ReportsPage /> },
              { path: "settings/*", element: <SettingsPage /> },
              { path: "*", element: <Navigate to="/dashboard" replace /> },
            ],
          },
          { path: "/login", element: <Navigate to="/dashboard" replace /> },
        ]
      : [
          { path: "/login", element: <LoginPage /> },
          { path: "*", element: <Navigate to="/login" replace /> },
        ]
  );

  if (isLoading) {
    return <Spinner />;
  }

  return routes;
};

export default Navigation;
