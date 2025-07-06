import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { useAuthStore } from "./store/authStore";

// Layout y Pages
import MainLayout from "@/Pages/Super_User/MainLayout/MainLayout";
import HomePage from "@/Pages/Super_User/HomePage/Home_page";
import LoginPage from "@/Pages/Super_User/LogIn/LogIn_page";
import { UserManagement } from "@/Pages/Super_User/UserManagement/UserManagementPage";
import { ProyectManagementPage } from "./Pages/Super_User/ProyectManagement/ProyectManagementPage";
import { ThemeProvider } from "@/components/ThemeProvider";

function ProtectedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="home" element={<HomePage />} />
        <Route path="UserManagement" element={<UserManagement />} />
        <Route path="ProyectManagement" element={<ProyectManagementPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  const { accounts } = useMsal();
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const isLoggedIn = accounts.length > 0 || isAuthenticated;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        {isLoggedIn ? (
          <ProtectedRoutes />
        ) : (
          <Routes>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;