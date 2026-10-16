import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          window.location.href = '/';
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Inicio de Sesión
          </h1>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="flex cursor-pointer w-full justify-center items-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50 transition-all duration-150"
          >
            {loginMutation.isPending ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
        {loginMutation.isError && (
          <div className="rounded-md bg-red-100 p-4">
            <p className="text-sm text-red-700">
              {loginMutation.error?.message || 'Error al iniciar sesión.'}
            </p>
          </div>
        )}
        <div className="text-center text-sm text-gray-600 mb-0">
          ¿Olvidaste tu contraseña?{' '}
          <Link
            to="/recovery"
            className="font-medium text-indigo-600 hover:text-indigo-500 underline focus:outline-none"
          >
            Recuperala aquí
          </Link>
        </div>
        <div className="text-center text-sm text-gray-600">
          ¿Todavía no tenés una cuenta?{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 underline focus:outline-none"
          >
            Registrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
