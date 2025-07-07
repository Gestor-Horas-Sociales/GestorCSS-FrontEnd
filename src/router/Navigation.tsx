"use client"

import { useRoutes, Navigate } from "react-router-dom"
import MainLayout from "@/Pages/MainLayout/MainLayout"
import LoginPage from "@/Pages/Auth/LoginPage"
import DashboardPage from "@/Pages/Dashboard/DashboardPage"
import UsersPage from "@/Pages/Users/UsersPage"
import ProjectsPage from "@/Pages/Projects/ProjectsPage"
import HoursPage from "@/Pages/Hours/HoursPage"
import ReportsPage from "@/Pages/Reports/ReportsPage"
import SettingsPage from "@/Pages/Settings/SettingsPage"
import { useAuthStore } from "@/store/authStore"
import { useEffect } from "react"

const Navigation = () => {
  const { initializeAuth, isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const routes = useRoutes(
    isAuthenticated
      ? [
          {
            path: "/",
            element: <MainLayout />,
            children: [
              { path: "dashboard", element: <DashboardPage /> },
              { path: "users/*", element: <UsersPage /> },
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
        ],
  )

  return routes
}

export default Navigation
