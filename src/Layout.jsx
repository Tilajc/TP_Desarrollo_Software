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
      <AppSidebar />
      <SidebarInset className="relative flex flex-col flex-1 overflow-y-auto bg-slate-950 text-slate-50">
        <SidebarTrigger className="absolute top-4 left-4 z-50 cursor-pointer" />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
