import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTopic } from '../hooks/useTopics';
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
];

const Summaries = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const { data: topic } = useTopic(topicId);
  const { data: summaries, isLoading, isError } = useSummaries(topicId);
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
      topicId: Number(topicId || formData.topicId),
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
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Botón Volver */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/subjects/${subjectId}/topics`)}
        className="cursor-pointer mb-4"
      >
        ← Volver a Temas
      </Button>

      {/* Header Mobile-First con botón adaptable w-full sm:w-auto */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Resúmenes{topic ? ` de ${topic.name}` : ''}
        </h1>
        <Button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Resumen
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          {summaries?.length === 0 && (
            <p className="text-slate-400">
              Este tema todavía no tiene resúmenes.
            </p>
          )}

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaries?.map((summary) => (
              <Card
                key={summary.id}
                className="flex flex-col justify-between min-h-[180px]"
              >
                <CardHeader className="flex-1 pb-2">
                  <CardTitle
                    className="text-lg font-semibold line-clamp-1"
                    title={summary.title}
                  >
                    {summary.title}
                  </CardTitle>
                  <CardDescription
                    className="text-slate-500 mt-2 line-clamp-2 cursor-help"
                    title={summary.content}
                  >
                    {summary.content}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex justify-end gap-2 pt-0 pb-4">
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
