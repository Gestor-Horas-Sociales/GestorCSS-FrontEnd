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

import { NavMain } from "@/components/ui/nav-main"
import { NavSecondary } from "@/components/ui/nav-secondary"
import { NavUser } from "@/components/ui/nav-user"
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

const data = {
  user: {
    name: "Óscar Arias",
    email: "admin@uca.edu.sv",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Métricas Generales",
          url: "/dashboard/metrics",
        },
        {
          title: "Análisis por Carrera",
          url: "/dashboard/careers",
        },
        {
          title: "Impacto Social",
          url: "/dashboard/impact",
        },
      ],
    },
    {
      title: "Gestión de Usuarios",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "Estudiantes",
          url: "/users/students",
        },
        {
          title: "Coordinadores",
          url: "/users/coordinators",
        },
        {
          title: "Importar Datos",
          url: "/users/import",
        },
      ],
    },
    {
      title: "Proyectos",
      url: "/projects",
      icon: BookOpen,
      items: [
        {
          title: "Gestión de Proyectos",
          url: "/projects/management",
        },
        {
          title: "Asignaciones",
          url: "/projects/assignments",
        },
        {
          title: "Mapa de Proyectos",
          url: "/projects/map",
        },
      ],
    },
    {
      title: "Seguimiento de Horas",
      url: "/hours",
      icon: Clock,
      items: [
        {
          title: "Registro de Horas",
          url: "/hours/register",
        },
        {
          title: "Validación",
          url: "/hours/validation",
        },
        {
          title: "Historial",
          url: "/hours/history",
        },
      ],
    },
    {
      title: "Reportes",
      url: "/reports",
      icon: FileText,
      items: [
        {
          title: "Reportes Individuales",
          url: "/reports/individual",
        },
        {
          title: "Reportes por Proyecto",
          url: "/reports/projects",
        },
        {
          title: "Memoria Anual",
          url: "/reports/annual",
        },
      ],
    },
    {
      title: "Configuración",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Departamentos",
          url: "/settings/departments",
        },
        {
          title: "Carreras",
          url: "/settings/careers",
        },
        {
          title: "Instituciones",
          url: "/settings/institutions",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Notificaciones",
      url: "/notifications",
      icon: Bell,
    },
    {
      title: "Calendario",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Soporte",
      url: "/support",
      icon: LifeBuoy,
    },
  ],
  projects: [
    {
      name: "Proyectos Activos",
      url: "/projects/active",
      icon: Frame,
    },
    {
      name: "Impacto Social",
      url: "/impact",
      icon: PieChart,
    },
    {
      name: "Ubicaciones",
      url: "/locations",
      icon: MapPin,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()

  // Filtrar navegación según el rol del usuario
  const getFilteredNavigation = () => {
    if (!user) return data.navMain

    switch (user.rol) {
      case "super_admin":
        return data.navMain // Acceso completo
      case "coordinador":
        return data.navMain.filter((item) => !["settings"].includes(item.url.split("/")[1]))
      case "estudiante":
        return data.navMain.filter((item) => ["dashboard", "hours", "projects"].includes(item.url.split("/")[1]))
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
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">UCA</span>
                  <span className="truncate text-xs">Horas Sociales</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getFilteredNavigation()} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.nombre + " " + user?.apellido || "Usuario",
            email: user?.email || "usuario@uca.edu.sv",
            avatar: "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
