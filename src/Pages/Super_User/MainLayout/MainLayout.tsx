// src/components/layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function MainLayout() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 pr-4">
              <Outlet /> {/* Aquí se renderiza el contenido de cada ruta */}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}