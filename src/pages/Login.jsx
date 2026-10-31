import { useState } from 'react';
import { Mail, Lock, Copy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import useLoginStatus from '../store/useLoginStatus';
import Captcha from '@/components/Captcha';
import { getRandomCharacters } from '@/utils/randomize';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [randomCaptcha, setRandomCaptcha] = useState(getRandomCharacters(6));
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const loginMutation = useLogin();
  const { login } = useLoginStatus();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaptchaError('');

    if (captchaInput !== randomCaptcha) {
      setCaptchaError('El código del captcha es incorrecto.');
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          login();
          navigate('/');
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Captcha
              </label>
              <Captcha
                word={randomCaptcha}
                updateCaptcha={() => {
                  setRandomCaptcha(getRandomCharacters(6));
                  setCaptchaInput('');
                }}
              />
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Copy className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                  placeholder="Copia el captcha"
                />
              </div>
              {captchaError && (
                <p className="mt-1 text-xs text-red-600">{captchaError}</p>
              )}
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
