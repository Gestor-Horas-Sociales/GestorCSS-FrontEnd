"use client";

import type * as React from "react";
import {
  BookOpen,
  Command,
  SquareTerminal,
  Users,
  Clock,
  FileText,
  Building,
  BookUser,
} from "lucide-react";
import { Link , useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { jwtDecode } from "jwt-decode";
import type { UserType } from "@/Types/UserType";
import { NavUser } from "@/components/ui/nav-user";

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
      title: "Estudiantes",
      url: "/students",
      icon: Users,
    },
    {
      title: "Instituciones",
      url: "/institutions",
      icon: Building,
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
        { title: "Reporte Anual", url: "/reports/annual" },
      ],
    },
    {
      title: "Gestión de Usuarios",
      url: "/users",
      icon: BookUser,
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const user = jwtDecode<UserType>(localStorage.getItem("token") || "{}");

  const getFilteredNavigation = () => {
    if (!user) return data.navMain;
    switch (user.role) {
      case 1:
        return data.navMain;
      case 3:
        return data.navMain.filter((item) => item.url !== "/settings");
      case 2:
        return data.navMain.filter((item) =>
          ["/dashboard", "/hours", "/projects"].includes(item.url)
        );
      default:
        return [];
    }
  };

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
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
            const isActive = location.pathname.startsWith(item.url);

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
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            // eslint-disable-next-line no-constant-binary-expression
            name: `${user?.name ?? ""} ${user?.lastname ?? ""}` || "Usuario",
            email: user?.email || "usuario@uca.edu.sv",
            avatar: "/avatars/default.jpg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
