import { useState } from 'react';
import { User, Mail, CheckCircle2, Lock } from 'lucide-react';
import { useGetMe, useUpdateProfile } from '@/hooks/useAuth';

const Profile = () => {
  const { data: user, isLoading: isLoadingUser, error: userError } = useGetMe();

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="text-center text-gray-500">Cargando perfil...</div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5 text-center">
          <div className="rounded-md bg-red-100 p-4">
            <p className="text-sm text-red-700">
              No se pudo cargar la información del usuario. Iniciá sesión
              nuevamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <ProfileForm user={user} />;
};

const ProfileForm = ({ user }) => {
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    name: user.name || '',
    lastName: user.lastName || '',
    email: user.email || '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    const dataToSubmit = { ...formData };
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    updateProfileMutation.mutate(dataToSubmit, {
      onSuccess: () => {
        setSuccessMessage('Perfil actualizado correctamente.');
        setFormData((prev) => ({ ...prev, password: '' }));
      },
    });
  };

  const isLoading = updateProfileMutation.isPending;
  const currentError = updateProfileMutation.error;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4 ring-8 ring-indigo-50/50">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Mi Perfil
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Actualizá la información de tu cuenta
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña{' '}
                <span className="text-gray-400 font-normal text-xs">
                  (Opcional)
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                  placeholder="Dejar en blanco para mantener la actual"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex cursor-pointer w-full justify-center items-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50 transition-all duration-150 mt-6"
          >
            {isLoading ? 'Guardando cambios...' : 'Guardar Cambios'}
          </button>
        </form>

        {successMessage && (
          <div className="flex items-center space-x-2 rounded-md bg-green-50 p-4 mt-4 border border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {currentError && (
          <div className="rounded-md bg-red-50 p-4 mt-4 border border-red-200">
            <p className="text-sm text-red-700">
              {currentError.message || 'Error al actualizar el perfil.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
