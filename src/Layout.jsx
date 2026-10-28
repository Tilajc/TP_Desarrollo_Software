import { Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';

const Layout = () => {
  return (
    <SidebarProvider>
      {/* Sidebar: offcanvas/drawer en móvil, fija en md/lg */}
      <AppSidebar />

      <SidebarInset className="relative flex flex-col flex-1 min-w-0 overflow-y-auto bg-slate-950 text-slate-50">
        {/* Barra superior Mobile-First: visible únicamente en mobile/sm, se oculta en md/lg */}
        <header className="flex h-14 items-center gap-3 border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur md:hidden sticky top-0 z-40">
          <SidebarTrigger className="cursor-pointer text-slate-300 hover:text-white" />
          <span className="text-sm font-semibold tracking-wide text-slate-200">
            Menú
          </span>
        </header>

        {/* Trigger discreto para colapsar en pantallas medianas y grandes */}
        <div className="hidden md:flex items-center px-6 pt-4">
          <SidebarTrigger className="cursor-pointer text-slate-400 hover:text-white" />
        </div>

        {/* Contenido principal con breakpoints Mobile-First: p-4 base, sm:p-6, lg:p-8 */}
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
