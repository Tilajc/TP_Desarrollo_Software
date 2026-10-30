import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, X, ListTree } from 'lucide-react';
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../../hooks/useSubjects';
import { useGetMe } from '../../hooks/useAuth';
import FormModal from '../../components/FormModal';
import { subjectSchema } from '../../schemas/subject';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

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
  const { data: me } = useGetMe();
  const isAdmin = me?.role === 'ADMIN';

  const navigate = useNavigate();

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

  const handleModalOpenChange = (isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      createMutation.reset();
      updateMutation.reset();
      setSelectedSubject(null);
    }
  };

  const handleSubmit = (formData) => {
    if (selectedSubject) {
      updateMutation.mutate(
        { id: selectedSubject.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            updateMutation.reset();
            setSelectedSubject(null);
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          createMutation.reset();
        },
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedSubject) return;
    deleteMutation.mutate(selectedSubject.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        deleteMutation.reset();
        setSelectedSubject(null);
      },
    });
  };

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar las materias.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Materias</h1>
        {isAdmin && (
          <Button
            onClick={handleOpenCreate}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
          >
            + Crear Materia
          </Button>
        )}
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects?.map((subject) => (
              <Card
                key={subject.id}
                className="flex flex-col justify-between relative"
              >
                {isAdmin && (
                  <div className="absolute right-0 top-0 z-10 flex gap-2 p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(subject)}
                      className="cursor-pointer"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleOpenDelete(subject)}
                      className="cursor-pointer"
                    >
                      <X />
                    </Button>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="mr-10">{subject.name}</CardTitle>
                  <CardDescription>
                    {subject.description || 'Sin descripción'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/subjects/${subject.id}/topics`)}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <ListTree />
                    Temas
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <FormModal
            key={
              selectedSubject ? `edit-${selectedSubject.id}` : 'create-subject'
            }
            open={isModalOpen}
            onOpenChange={handleModalOpenChange}
            title={selectedSubject ? 'Editar Materia' : 'Nueva Materia'}
            fields={SUBJECT_FIELDS}
            initialData={selectedSubject}
            schema={subjectSchema}
            onSubmit={handleSubmit}
            error={createMutation.error || updateMutation.error}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={
              isDeleteModalOpen
                ? `delete-${selectedSubject?.id}`
                : 'delete-closed'
            }
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => {
              setIsDeleteModalOpen(isOpen);
              if (!isOpen) setSelectedSubject(null);
            }}
            title={`¿Deseas eliminar la materia "${selectedSubject?.name}"?`}
            fields={[]}
            onSubmit={handleDeleteSubmit}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default Subjects;
