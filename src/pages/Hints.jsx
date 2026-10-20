import { useState } from 'react';
import {
  useHints,
  useCreateHint,
  useUpdateHint,
  useDeleteHint,
} from '../hooks/useHints';
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

const HINT_FIELDS = [
  {
    name: 'content',
    label: 'Contenido de la pista',
    placeholder: 'Ej: Recordar la definición de la propiedad conmutativa',
    required: true,
  },
  {
    name: 'cardId',
    label: 'ID de la Tarjeta (Card)',
    placeholder: 'Ej: 1',
    type: 'number',
    required: true,
  },
];

const Hints = () => {
  const { data: hints, isLoading, isError } = useHints();
  const createMutation = useCreateHint();
  const updateMutation = useUpdateHint();
  const deleteMutation = useDeleteHint();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHint, setSelectedHint] = useState(null);

  const handleOpenCreate = () => {
    setSelectedHint(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hint) => {
    setSelectedHint(hint);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (hint) => {
    setSelectedHint(hint);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const payload = {
      ...formData,
      cardId: Number(formData.cardId),
    };
    if (selectedHint) {
      updateMutation.mutate(
        { id: selectedHint.id, data: payload },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedHint) return;
    deleteMutation.mutate(selectedHint.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar las pistas</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pistas</h1>
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Pista
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hints?.map((hint) => (
              <Card key={hint.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {hint.content}
                  </CardTitle>
                  <CardDescription>Tarjeta ID: {hint.cardId}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(hint)}
                    className="cursor-pointer"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(hint)}
                    className="cursor-pointer"
                  >
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <FormModal
            key={selectedHint ? `edit-${selectedHint.id}` : 'create-hint'}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title={selectedHint ? 'Editar Pista' : 'Nueva Pista'}
            fields={HINT_FIELDS}
            initialData={selectedHint}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={selectedHint ? `delete-${selectedHint.id}` : 'delete-hint'}
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title={`¿Deseas eliminar esta pista?`}
            fields={[]}
            onSubmit={handleDeleteSubmit}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default Hints;
