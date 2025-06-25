import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/ui/login-form"
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "@/auth/authConfig"

import LoginImage from "../../../assets/bgLogInImage.jpg"

export default function LoginPage() {
  const { instance } = useMsal()

  const handleMicrosoftLogin = async () => {
    try {
      await instance.loginPopup(loginRequest)
    } catch (error) {
      console.error("Error al iniciar sesión con Microsoft:", error)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <GalleryVerticalEnd className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Universidad Centroamericana José Simeón Cañas</h1>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>

          {/* Botón de login con Microsoft */}
          <button
            onClick={handleMicrosoftLogin}
            className="w-full max-w-xs rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Iniciar sesión con Microsoft
          </button>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={LoginImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}