// src/components/LogoutButton.tsx
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";

export function LogoutButton() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Cerrar sesión
    </button>
  );
}
