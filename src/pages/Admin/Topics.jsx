import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, X, FileText, Layers } from 'lucide-react';
import { useSubject } from '../../hooks/useSubjects';
import {
  useTopics,
  useCreateTopic,
  useUpdateTopic,
  useDeleteTopic,
} from '../../hooks/useTopics';
import FormModal from '../../components/FormModal';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

const TOPIC_FIELDS = [
  {
    name: 'name',
    label: 'Nombre del Tema',
    placeholder: 'Ej: Límites y continuidad',
    required: true,
  },
];

const Topics = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const { data: subject } = useSubject(subjectId);
  const { data: topics, isLoading, isError } = useTopics(subjectId);
  const createMutation = useCreateTopic();
  const updateMutation = useUpdateTopic();
  const deleteMutation = useDeleteTopic();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleOpenCreate = () => {
    setSelectedTopic(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (topic) => {
    setSelectedTopic(topic);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (topic) => {
    setSelectedTopic(topic);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedTopic) {
      updateMutation.mutate(
        { id: selectedTopic.id, data: formData },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(
        { ...formData, subjectId: Number(subjectId) },
        { onSuccess: () => setIsModalOpen(false) }
      );
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedTopic) return;
    deleteMutation.mutate(selectedTopic.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar los temas.</p>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/subjects')}
        className="cursor-pointer mb-4"
      >
        ← Volver a Materias
      </Button>

      {/* Solo se ajustó el layout del header para que no rompa en mobile */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Temas{subject ? ` de ${subject.name}` : ''}
        </h1>
        <Button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Tema
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          {topics?.length === 0 && (
            <p className="text-slate-400">
              Esta materia todavía no tiene temas.
            </p>
          )}

          {/* Se sumó sm:grid-cols-2 para cubrir los 3 breakpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics?.map((topic) => (
              <Card
                key={topic.id}
                className="flex flex-col justify-between relative"
              >
                <div className="absolute right-0 top-0 z-10 flex gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(topic)}
                    className="cursor-pointer"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(topic)}
                    className="cursor-pointer"
                  >
                    <X />
                  </Button>
                </div>

                <CardHeader>
                  <CardTitle className="mr-10">{topic.name}</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/subjects/${subject.id}/topics/${topic.id}/summaries`
                      )
                    }
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FileText />
                    Resumenes
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(
                        `/subjects/${subject.id}/topics/${topic.id}/cards`
                      )
                    }
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Layers />
                    Tarjetas
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <FormModal
            key={selectedTopic ? `edit-${selectedTopic.id}` : 'create-topic'}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title={selectedTopic ? 'Editar Tema' : 'Nuevo Tema'}
            fields={TOPIC_FIELDS}
            initialData={selectedTopic}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={selectedTopic ? `delete-${selectedTopic.id}` : 'delete-topic'}
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title={`¿Deseas eliminar el tema "${selectedTopic?.name}"?`}
            fields={[]}
            onSubmit={handleDeleteSubmit}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default Topics;
