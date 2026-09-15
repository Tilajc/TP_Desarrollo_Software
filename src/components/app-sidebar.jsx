import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="w-64 bg-slate-900 border-r border-slate-800" />
      <SidebarContent className="w-64 bg-slate-900 border-r border-slate-800">
        <nav className="p-4">
          <ul className="flex flex-col gap-2">
            <li className="mb-4">
              <Link
                to="/"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Inicio
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/materias"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Materias
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/apuntes"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Apuntes
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/tarjetas"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Tarjetas
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/alumno"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Alumno
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/resumen"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Resumen
              </Link>
            </li>
          </ul>
        </nav>
      </SidebarContent>
      <SidebarFooter className="w-64 bg-slate-900 border-r border-slate-800" />
    </Sidebar>
  );
};

export default AppSidebar;
