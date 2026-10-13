import { useState } from 'react';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '../hooks/useUsers';
import FormModal from '../components/FormModal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

// Función que define los campos: hace la contraseña opcional si se está editando
const getFields = (isEditing) => [
  {
    name: 'name',
    label: 'Nombre del Usuario',
    placeholder: 'Ej: Pepe',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Apellido',
    placeholder: 'Garcia',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'pepe@garcia.com',
    required: true,
  },
  {
    name: 'password',
    label: isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña',
    type: 'password',
    placeholder: isEditing
      ? 'Dejar en blanco para mantener la actual'
      : '********',
    required: !isEditing, // Obligatoria solo al crear, opcional al editar
  },
  {
    name: 'docket',
    label: 'Numero de Legajo',
    placeholder: 'Ej: 44094',
    type: 'text',
    required: true,
  },
  {
    name: 'role',
    label: 'Rol',
    type: 'select',
    options: [
      { label: 'Alumno', value: 'STUDENT' },
      { label: 'Profesor', value: 'TEACHER' },
      { label: 'Administrador', value: 'ADMIN' },
    ],
    required: true,
  },
];

const Users = () => {
  const { data: users, isLoading, isError } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const payload = {
      ...formData,
      docket: formData.docket ? String(formData.docket) : '',
    };

    if (selectedUser) {
      // Si la contraseña quedó vacía al editar, la quitamos para no sobrescribir la actual
      if (!payload.password) {
        delete payload.password;
      }

      updateMutation.mutate(
        { id: selectedUser.id, data: payload },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedUser) return;
    deleteMutation.mutate(selectedUser.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar los usuarios.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Usuario
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users?.map((user) => (
              <Card key={user.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>
                    {user.name} {user.lastName}
                  </CardTitle>
                  <CardDescription>
                    {user.role || 'Sin rol asignado'} - Legajo: {user.docket}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(user)}
                    className="cursor-pointer"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(user)}
                    className="cursor-pointer"
                  >
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Modal de Crear / Editar */}
          <FormModal
            key={selectedUser ? `edit-${selectedUser.id}` : 'create-user'}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            fields={getFields(Boolean(selectedUser))}
            initialData={selectedUser}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          {/* Modal de Confirmación de Eliminación */}
          <FormModal
            key={selectedUser ? `delete-${selectedUser.id}` : 'delete-user'}
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title={`¿Deseas eliminar al usuario "${selectedUser?.name}"?`}
            fields={[]}
            onSubmit={handleDeleteSubmit}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default Users;
