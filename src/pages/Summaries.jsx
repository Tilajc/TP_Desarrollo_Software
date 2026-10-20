import { useState } from 'react';
import {
  useSummaries,
  useCreateSummary,
  useUpdateSummary,
  useDeleteSummary,
} from '../hooks/useSummaries';
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

const SUMMARY_FIELDS = [
  {
    name: 'title',
    label: 'Título del resumen',
    placeholder: 'Ej: Regla de la Cadena y Derivación',
    required: true,
  },
  {
    name: 'content',
    label: 'Contenido / Explicación',
    placeholder: 'Escribe aquí la explicación detallada...',
    type: 'textarea',
    required: true,
  },
  {
    name: 'topicId',
    label: 'ID del Tema (Topic)',
    placeholder: 'Ej: 2',
    type: 'number',
    required: true,
  },
];

const Summaries = () => {
  const { data: summaries, isLoading, isError } = useSummaries();
  const createMutation = useCreateSummary();
  const updateMutation = useUpdateSummary();
  const deleteMutation = useDeleteSummary();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  const handleOpenCreate = () => {
    setSelectedSummary(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (summary) => {
    setSelectedSummary(summary);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (summary) => {
    setSelectedSummary(summary);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const payload = {
      ...formData,
      topicId: Number(formData.topicId),
    };

    if (selectedSummary) {
      updateMutation.mutate(
        { id: selectedSummary.id, data: payload },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedSummary) return;
    deleteMutation.mutate(selectedSummary.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar los resúmenes.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resúmenes</h1>
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Resumen
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaries?.map((summary) => (
              <Card key={summary.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {summary.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-slate-300">
                    {summary.content}
                  </CardDescription>
                  <span className="text-xs text-slate-500 mt-2 block">
                    Tema ID: {summary.topicId}
                  </span>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(summary)}
                    className="cursor-pointer"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(summary)}
                    className="cursor-pointer"
                  >
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <FormModal
            key={
              selectedSummary ? `edit-${selectedSummary.id}` : 'create-summary'
            }
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title={selectedSummary ? 'Editar Resumen' : 'Nuevo Resumen'}
            fields={SUMMARY_FIELDS}
            initialData={selectedSummary}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={
              selectedSummary
                ? `delete-${selectedSummary.id}`
                : 'delete-summary'
            }
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title={`¿Deseas eliminar el resumen "${selectedSummary?.title}"?`}
            fields={[]}
            onSubmit={handleDeleteSubmit}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default Summaries;
