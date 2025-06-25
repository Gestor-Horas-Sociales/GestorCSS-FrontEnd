// src/components/LogoutButton.tsx
import { useManualAuth } from "@/auth/authContext";
import { useMsal } from "@azure/msal-react";

export function LogoutButton() {
  const { logoutManual } = useManualAuth();
  const { instance } = useMsal();

  const handleLogout = () => {
    logoutManual(); // Cierra sesión manual
    instance.logoutPopup(); // Cierra sesión MSAL si aplica
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