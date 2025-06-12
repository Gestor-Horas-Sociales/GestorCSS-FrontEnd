import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/ui/login-form"

import LoginImage from "../../../assets/bgLogInImage.jpg"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
            <GalleryVerticalEnd className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Universidad Centroamericana José Simeón Cañas</h1>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
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
