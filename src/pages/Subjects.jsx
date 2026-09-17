import { useState } from 'react';
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../hooks/useSubjects';
import FormModal from '../components/FormModal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SUBJECT_FIELDS = [
  {
    name: 'name',
    label: 'Nombre de la Materia',
    placeholder: 'Ej: Análisis Matemático I',
    required: true,
  },
  {
    name: 'description',
    label: 'Descripción',
    placeholder: 'Descripción opcional',
    required: false,
  },
];

const Subjects = () => {
  const { data: subjects, isLoading, isError } = useSubjects();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleOpenCreate = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (subject) => {
    setSelectedSubject(subject);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedSubject) {
      updateMutation.mutate(
        { id: selectedSubject.id, data: formData },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedSubject) return;
    deleteMutation.mutate(selectedSubject.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  if (isLoading)
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Materias</h1>
          <Button
            onClick={handleOpenCreate}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
          >
            + Crear Materia
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="w-full max-w-xs">
              <CardHeader>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-video w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar las materias.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Materias</h1>
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Materia
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects?.map((subject) => (
          <Card key={subject.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{subject.name}</CardTitle>
              <CardDescription>
                {subject.description || 'Sin descripción'}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(subject)}
                className="cursor-pointer"
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleOpenDelete(subject)}
                className="cursor-pointer"
              >
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <FormModal
        key={selectedSubject ? `edit-${selectedSubject.id}` : 'create-subject'}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedSubject ? 'Editar Materia' : 'Nueva Materia'}
        fields={SUBJECT_FIELDS}
        initialData={selectedSubject}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <FormModal
        key={
          selectedSubject ? `delete-${selectedSubject.id}` : 'delete-subject'
        }
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={`¿Deseas eliminar la materia "${selectedSubject?.name}"?`}
        fields={[]}
        onSubmit={handleDeleteSubmit}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Subjects;
