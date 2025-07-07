import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/auth/authConfig";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";
import { Toaster, toast } from "sonner";
import { ModeToggle } from "@/components/ModeToggle";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router";

interface AxiosErrorLike {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export default function LoginPage() {
  const { instance } = useMsal();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleMicrosoftLogin = async () => {
    try {
      const loginResponse = await instance.loginPopup(loginRequest);

      const idToken = loginResponse.idToken;

      const response = await api.post("/auth/microsoft", {
        accessToken: idToken,
      });

      if (response.status === 200) {
        const token = response.data.token;

        // Guardar el token en localStorage
        localStorage.setItem("token", token);

        // Actualizar el estado de autenticación
        login();

        // Redirigir al usuario a la página de inicio
        navigate("/home");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      const axiosError = error as AxiosErrorLike;

      if (axiosError.response?.status === 401) {
        toast.error(axiosError.response?.data?.message);
      } else {
        toast.error("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Panel izquierdo - Información institucional */}
        <div className="hidden lg:flex lg:flex-1">
          <div className="flex flex-col justify-center px-12 py-16">
            <div className="max-w-lg">
              {/* Escudo universitario */}
              <ModeToggle />
              <div className="mb-8 w-full text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 bg-slate-600">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  Universidad Centroamericana "José Simeón Cañas"
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho - Formulario de login */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Header móvil */}
            <div className="lg:hidden text-center mb-8 space-y-3">
              <div className="flex justify-end">
                <ModeToggle />
              </div>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-slate-600">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">
                Universidad Centroamericana "José Simeón Cañas"
              </h1>
              <p>Sistema de Horas Sociales</p>
            </div>

            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">
                  Acceso al Sistema
                </CardTitle>
                <CardDescription>
                  Utilice sus credenciales institucionales de Microsoft para
                  ingresar al Sistema de Gestión de Horas Sociales
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button
                  onClick={handleMicrosoftLogin}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer rounded-lg px-4 py-2"
                  size="lg"
                >
                  <div className="flex items-center justify-center space-x-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <rect x="1" y="1" width="10" height="10" fill="#F35325" />
                      <rect
                        x="13"
                        y="1"
                        width="10"
                        height="10"
                        fill="#81BC06"
                      />
                      <rect
                        x="1"
                        y="13"
                        width="10"
                        height="10"
                        fill="#05A6F0"
                      />
                      <rect
                        x="13"
                        y="13"
                        width="10"
                        height="10"
                        fill="#FFBA08"
                      />
                    </svg>
                  </div>
                  <span className="ml-2">Iniciar sesión con Microsoft</span>
                </Button>

                <Separator />

                {/* Información de seguridad */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm">
                        Acceso Seguro
                      </h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Este sistema utiliza autenticación Microsoft.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer informativo */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                © Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}
