import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useLoginStatus from '../store/useLoginStatus';

const AppSidebar = () => {
  const { isLoggedIn, logout } = useLoginStatus();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  return (
    <Sidebar>
      <SidebarHeader className="w-64 bg-slate-900 border-r border-slate-800" />
      <SidebarContent className="w-64 bg-slate-900 border-r border-slate-800">
        <nav className="flex flex-col justify-between p-4 h-full">
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
                to="/subjects"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Materias
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/notes"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Apuntes
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/cards"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Tarjetas
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/students"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Alumnos
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/summaries"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Resumen
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/users"
                className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              >
                Usuarios
              </Link>
            </li>
          </ul>
          {isLoggedIn ? (
            <Link
              className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Link>
          ) : (
            <Link
              to="/login"
              className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
              onClick={() => {
                localStorage.removeItem('token');
              }}
            >
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </SidebarContent>
      <SidebarFooter className="w-64 bg-slate-900 border-r border-slate-800" />
    </Sidebar>
  );
};

export default AppSidebar;
