import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

// Layout y Pages
import MainLayout from "@/Pages/Super_User/MainLayout/MainLayout";
import HomePage from "@/Pages/Super_User/HomePage/Home_page";
import LoginPage from "@/Pages/Super_User/LogIn/LogIn_page";
import { UserManagement } from "@/Pages/Super_User/UserManagement/UserManagementPage";
import { ProyectManagementPage } from "./Pages/Super_User/ProyectManagement/ProyectManagementPage";
import { ThemeProvider } from "@/assets/components/ThemeProvider";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Rutas de super usuario */}
        <Route path="/" element={<MainLayout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="UserManagement" element={<UserManagement />} />
          <Route path="ProyectManagement" element={<ProyectManagementPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <AuthenticatedTemplate>
            <AppRoutes />
          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>
            <Routes>
              <Route path="*" element={<LoginPage />} />
            </Routes>
          </UnauthenticatedTemplate>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;