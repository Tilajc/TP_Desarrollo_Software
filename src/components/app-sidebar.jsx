import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <nav className="p-4">
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/" className="block p-2 hover:bg-accent rounded">
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/materias"
                className="block p-2 hover:bg-accent rounded"
              >
                Materias
              </Link>
            </li>
            <li>
              <Link to="/apuntes" className="block p-2 hover:bg-accent rounded">
                Apuntes
              </Link>
            </li>
            <li>
              <Link
                to="/tarjetas"
                className="block p-2 hover:bg-accent rounded"
              >
                Tarjetas
              </Link>
            </li>
          </ul>
        </nav>
        {/* <SidebarGroup /> */}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
