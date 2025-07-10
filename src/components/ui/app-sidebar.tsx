"use client"

import type * as React from "react"
import {
  BookOpen,
  Command,
  Frame,
  LifeBuoy,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  Clock,
  FileText,
  Bell,
  Calendar,
  MapPin,
} from "lucide-react"
import { Link } from "react-router-dom" // 👈 IMPORTANTE

import { useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAuthStore } from "@/store/authStore"
import { NavUser } from "@/components/ui/nav-user"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      items: [
        { title: "Métricas Generales", url: "/dashboard/metrics" },
        { title: "Análisis por Carrera", url: "/dashboard/careers" },
        { title: "Impacto Social", url: "/dashboard/impact" },
      ],
    },
    {
      title: "Gestión de Usuarios",
      url: "/users",
      icon: Users,
      items: [
        { title: "Estudiantes", url: "/users/students" },
        { title: "Coordinadores", url: "/users/coordinators" },
        { title: "Importar Datos", url: "/users/import" },
      ],
    },
    {
      title: "Proyectos",
      url: "/projects",
      icon: BookOpen,
      items: [
        { title: "Gestión de Proyectos", url: "/projects/management" },
        { title: "Asignaciones", url: "/projects/assignments" },
        { title: "Mapa de Proyectos", url: "/projects/map" },
      ],
    },
    {
      title: "Seguimiento de Horas",
      url: "/hours",
      icon: Clock,
      items: [
        { title: "Registro de Horas", url: "/hours/register" },
        { title: "Validación", url: "/hours/validation" },
        { title: "Historial", url: "/hours/history" },
      ],
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: FileText,
      items: [
        { title: "Reportes Individuales", url: "/reports/individual" },
        { title: "Reportes por Proyecto", url: "/reports/projects" },
        { title: "Memoria Anual", url: "/reports/annual" },
      ],
    },
    {
      title: "Configuración",
      url: "/settings",
      icon: Settings2,
      items: [
        { title: "Departamentos", url: "/settings/departments" },
        { title: "Carreras", url: "/settings/careers" },
        { title: "Instituciones", url: "/settings/institutions" },
      ],
    },
  ],
  navSecondary: [
    { title: "Notificaciones", url: "/notifications", icon: Bell },
    { title: "Calendario", url: "/calendar", icon: Calendar },
    { title: "Soporte", url: "/support", icon: LifeBuoy },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()
  const location = useLocation()

  const getFilteredNavigation = () => {
    if (!user) return data.navMain
    switch (user.rol) {
      case "super_admin":
        return data.navMain
      case "coordinador":
        return data.navMain.filter((item) => item.url !== "/settings")
      case "estudiante":
        return data.navMain.filter((item) =>
          ["/dashboard", "/hours", "/projects"].includes(item.url)
        )
      default:
        return []
    }
  }

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">UCA</span>
                  <span className="truncate text-xs">Horas Sociales</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {getFilteredNavigation().map((item) => {
            const isActive = location.pathname.startsWith(item.url)

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        {/* Subnavegación */}
        <SidebarMenu className="mt-4">
          {data.navSecondary.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname.startsWith(item.url)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            // eslint-disable-next-line no-constant-binary-expression
            name: `${user?.nombre ?? ""} ${user?.apellido ?? ""}` || "Usuario",
            email: user?.email || "usuario@uca.edu.sv",
            avatar: "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}