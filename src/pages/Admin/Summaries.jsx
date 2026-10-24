import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTopic } from '../../hooks/useTopics';
import {
  useSummaries,
  useCreateSummary,
  useUpdateSummary,
  useDeleteSummary,
} from '../../hooks/useSummaries';
import FormModal from '../../components/FormModal';
import { summarySchema } from '../../schemas/summary';
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

  const handleModalOpenChange = (isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      createMutation.reset();
      updateMutation.reset();
      setSelectedSummary(null);
    }
  };

  const handleSubmit = (formData) => {
    const payload = {
      ...formData,
      topicId: Number(topicId || formData.topicId),
    };

    if (selectedSummary) {
      updateMutation.mutate(
        { id: selectedSummary.id, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            updateMutation.reset();
            setSelectedSummary(null);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          createMutation.reset();
        },
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedSummary) return;
    deleteMutation.mutate(selectedSummary.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        deleteMutation.reset();
        setSelectedSummary(null);
      },
    });
  };

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar los resúmenes.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Botón idéntico al de TopicCards */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/subjects/${subjectId}/topics`)}
        className="cursor-pointer mb-4"
      >
        ← Volver a Temas
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Resúmenes{topic ? ` de ${topic.name}` : ''}
        </h1>
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
          {summaries?.length === 0 && (
            <p className="text-slate-400">
              Este tema todavía no tiene resúmenes.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaries?.map((summary) => (
              <Card key={summary.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {summary.title}
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    {summary.content}
                  </CardDescription>
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
            onOpenChange={handleModalOpenChange}
            title={selectedSummary ? 'Editar Resumen' : 'Nuevo Resumen'}
            fields={SUMMARY_FIELDS}
            initialData={selectedSummary}
            schema={summarySchema}
            onSubmit={handleSubmit}
            error={createMutation.error || updateMutation.error}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={
              isDeleteModalOpen
                ? `delete-${selectedSummary?.id}`
                : 'delete-closed'
            }
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => {
              setIsDeleteModalOpen(isOpen);
              if (!isOpen) setSelectedSummary(null);
            }}
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
