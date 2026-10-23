import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import useLoginStatus from '../store/useLoginStatus';
import { useGetMe } from '../hooks/useAuth';

const MENU_ITEMS = [
  {
    title: 'Inicio',
    to: '/',
    roles: ['ADMIN', 'USER'],
  },
  {
    title: 'Alumnos',
    to: '/students',
    roles: ['USER'],
  },
  {
    title: 'Materias',
    to: '/subjects',
    roles: ['ADMIN', 'USER'],
  },

  {
    title: 'Apuntes',
    to: '/notes',
    roles: ['USER'],
  },
  {
    title: 'Tarjetas',
    to: '/cards',
    roles: ['USER'],
  },
  {
    title: 'Resumen',
    to: '/summaries',
    roles: ['USER'],
  },
  // Opciones exclusivas de ADMIN
  {
    title: 'Usuarios',
    to: '/users',
    roles: ['ADMIN'],
  },

  {
    title: 'Cursos',
    to: '/courses',
    roles: ['ADMIN'],
  },
  {
    title: 'Inscripciones',
    to: '/admin/course-subscriptions',
    roles: ['ADMIN'],
  },
];

const AppSidebar = () => {
  const { isLoggedIn, logout } = useLoginStatus();
  const { data: user } = useGetMe();
  const navigate = useNavigate();

  const userRole = user?.role ? user.role.toUpperCase() : 'USER';

  const visibleMenuItems = MENU_ITEMS.filter((item) => {
    if (!isLoggedIn) {
      return (
        item.roles.includes('USER') &&
        (item.to === '/' || item.to === '/subjects')
      );
    }
    return item.roles.includes(userRole);
  });

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
            {visibleMenuItems.map((item) => (
              <li key={item.to} className="mb-2">
                <Link
                  to={item.to}
                  className="block p-2 text-md font-semibold text-slate-400 hover:text-slate-50 hover:bg-slate-800 rounded transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-slate-800">
            {isLoggedIn ? (
              <button
                type="button"
                className="w-full text-left block p-2 text-md font-semibold text-red-400 hover:text-red-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
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
          </div>
        </nav>
      </SidebarContent>
      <SidebarFooter className="w-64 bg-slate-900 border-r border-slate-800" />
    </Sidebar>
  );
};

export default AppSidebar;
