import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/ui/site-header"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function MainLayout() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      {/* 1. Aseguramos que el provider ocupe toda la pantalla y no permita scroll en el body */}
      <SidebarProvider className="flex flex-col h-screen w-full overflow-hidden">
        
        <SiteHeader />
        
        {/* 2. Contenedor flex principal: ocupa el espacio restante y oculta desbordes */}
        <div className="flex flex-1 h-[calc(100vh-var(--header-height))] overflow-hidden">
          <AppSidebar />
          
          <SidebarInset className="flex flex-col flex-1 overflow-hidden">
            {/* 3. EL FIX CLAVE: 'min-w-0'
               Esto fuerza a flexbox a respetar el ancho disponible, obligando
               a la tabla a usar su propio scroll en lugar de empujar el layout.
               
               'overflow-y-auto' habilita el scroll vertical solo en el contenido.
            */}
            <div className="flex flex-1 flex-col h-full overflow-y-auto min-w-0 p-4 md:p-6">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}