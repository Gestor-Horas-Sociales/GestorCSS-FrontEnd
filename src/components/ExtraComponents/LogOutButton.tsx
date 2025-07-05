// src/components/LogoutButton.tsx
import { useAuth } from "@/context/authContext";
import { useMsal } from "@azure/msal-react";

export function LogoutButton() {
  const { logout } = useAuth(); // ✅ usamos logout en vez de logoutManual
  const { instance } = useMsal();

  const handleLogout = () => {
    logout(); // Borra token y estado de sesión
    instance.logoutPopup(); // Finaliza sesión con MSAL (puedes usar logoutRedirect si prefieres)
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