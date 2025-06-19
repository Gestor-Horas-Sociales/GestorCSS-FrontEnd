import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout y Pages
import MainLayout from "@/Pages/Super_User/MainLayout/MainLayout";
import HomePage from "@/Pages/Super_User/HomePage/Home_page";
import LoginPage from "@/Pages/Super_User/LogIn/LogIn_page";
import { UserManagement } from "@/Pages/Super_User/UserManagement/UserManagementPage";
import ProyectManagementPage from "./Pages/Super_User/ProyectManagement/ProyectManagementPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* Rutas de super usuario */}
        <Route path="/" element={<MainLayout />}>
          <Route path="home" element={<HomePage />} />
          <Route path="UserManagement" element={<UserManagement />} />
          <Route path="ProyectManagement" element={<ProyectManagementPage />} />
          {/* Puedes seguir agregando más rutas aquí */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;