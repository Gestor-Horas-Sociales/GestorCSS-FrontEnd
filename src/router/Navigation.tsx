import { useRoutes, Navigate } from "react-router-dom";
import MainLayout from "@/Pages/MainLayout/MainLayout";
import LoginPage from "@/Pages/Auth/LoginPage";
import DashboardPage from "@/Pages/Dashboard/DashboardPage";
import Stundent from "@/Pages/Stundent/StudentsPage";
import ProjectsPage from "@/Pages/Projects/ProjectsPage";
import HoursPage from "@/Pages/Hours/HoursPage";
import ReportsPage from "@/Pages/Reports/ReportsPage";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import Institutions from "@/Pages/Institutions/Institutions";
import Spinner from "@/components/Spinner";
import User from "@/Pages/Users/User";
import Map from "@/Pages/Map/Page";

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
              { path: "students/*", element: <Stundent /> },
              { path: "institutions/*", element: <Institutions /> },
              { path: "projects/*", element: <ProjectsPage /> },
              { path: "hours/*", element: <HoursPage /> },
              { path: "reports/*", element: <ReportsPage /> },
              { path: "users/*", element: <User /> },
              { path: "map/*", element: <Map /> },
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
