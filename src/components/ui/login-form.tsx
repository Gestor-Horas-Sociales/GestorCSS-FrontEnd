import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useManualAuth } from "@/auth/authContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginManual } = useManualAuth();

  function logInValidations(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email === "admin@uca.edu.sv" && password === "12345678") {
      alert("Inicio de sesión exitoso.");
      loginManual(); // 👈 ahora se marca como logueado manualmente
      navigate("/home");
    } else {
      alert("Credenciales inválidas.");
    }
  }

  return (
    <form
      onSubmit={logInValidations}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          Portal Gestor de proyectos de horas sociales
        </h1>
        <h3>Facultad de ingeniería y arquitectura</h3>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Usuario</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  );
}
