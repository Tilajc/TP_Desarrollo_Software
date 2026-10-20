import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, X, ListTree } from 'lucide-react';
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from '../../hooks/useCourses';
import FormModal from '../../components/FormModal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';
import { useUsers } from '@/hooks/useUsers';
import { useSubjects } from '@/hooks/useSubjects';

const Courses = () => {
  const { data: courses, isLoading, isError } = useCourses();
  const { data: users } = useUsers();
  const { data: subjects } = useSubjects();

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courseFields = useMemo(() => {
    return [
      {
        name: 'year',
        label: 'Año del curso',
        placeholder: 'Ej: 2023',
        required: true,
      },
      {
        name: 'teacherId',
        label: 'Autor',
        type: 'select',
        required: true,
        options:
          users?.map((user) => ({
            value: user.id,
            label: `${user.name} ${user.lastName}`,
          })) || [],
      },
      {
        name: 'subjectId',
        label: 'Materia (Subject)',
        type: 'select',
        required: true,
        options:
          subjects?.map((subject) => ({
            value: subject.id,
            label: subject.name,
          })) || [],
      },
    ];
  }, [users, subjects]);

  const handleOpenCreate = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedCourse) {
      updateMutation.mutate(
        { id: selectedCourse.id, data: formData },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedCourse) return;
    deleteMutation.mutate(selectedCourse.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar los cursos.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cursos</h1>
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Curso
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses?.map((course) => (
              <Card
                key={course.id}
                className="flex flex-col justify-between relative"
              >
                <div className="absolute right-0 top-0 z-10 flex gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(course)}
                    className="cursor-pointer"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(course)}
                    className="cursor-pointer"
                  >
                    <X />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle className="mr-10">
                    {course.subject.name || `Curso ${course.year}`}
                  </CardTitle>
                  <CardDescription>
                    <span className="block">Año: {course.year}</span>
                    <span className="block">
                      Autor:{' '}
                      {course.teacher
                        ? `${course.teacher.name} ${course.teacher.lastName}`
                        : 'No asignado'}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/courses/${course.id}/topics`)}
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
            key={selectedCourse ? `edit-${selectedCourse.id}` : 'create-course'}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title={selectedCourse ? 'Editar Curso' : 'Nuevo Curso'}
            fields={courseFields}
            initialData={selectedCourse}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={
              selectedCourse ? `delete-${selectedCourse.id}` : 'delete-course'
            }
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title={`¿Deseas eliminar el curso "${selectedCourse?.name || selectedCourse?.year}"?`}
            fields={[]}
            onSubmit={handleDeleteSubmit}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default Courses;
