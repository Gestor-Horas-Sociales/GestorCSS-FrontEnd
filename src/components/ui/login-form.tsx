import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/auth/authConfig";
import api from "@/api/axios";

export function LoginForm() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const loginResponse = await instance.loginPopup(loginRequest);

      const idToken = loginResponse.idToken;

      console.log("ID Token:", idToken);

      await api.post("/auth/microsoft", { accessToken: idToken });

      navigate("/home");
    } catch (err) {
      console.error("Error al iniciar sesión con MSAL:", err);
      alert("No se pudo iniciar sesión.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {/* otros inputs */}

      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {/* Logo Microsoft SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          <rect x="1" y="1" width="10" height="10" fill="#F35325" />
          <rect x="13" y="1" width="10" height="10" fill="#81BC06" />
          <rect x="1" y="13" width="10" height="10" fill="#05A6F0" />
          <rect x="13" y="13" width="10" height="10" fill="#FFBA08" />
        </svg>
        Iniciar sesión con Microsoft
      </button>
    </form>
  );
}
