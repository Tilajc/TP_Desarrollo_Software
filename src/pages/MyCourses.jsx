import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, FolderOpen } from 'lucide-react';
import {
  useCourses,
  useCreateCourse,
  useDeleteCourse,
} from '@/hooks/useCourses';
import { useSubjects } from '@/hooks/useSubjects';
import { useGetMe } from '@/hooks/useAuth';
import FormModal from '@/components/FormModal';
import { courseSchema } from '@/schemas/course';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';
import SearchInput from '@/components/SearchInput';
import useSearch from '@/hooks/useSearch';

const MyCourses = () => {
  const navigate = useNavigate();

  const { data: me } = useGetMe();
  const {
    data: courses,
    isLoading,
    isError,
  } = useCourses({ authorId: me?.id }, !!me);
  const {
    query,
    setQuery,
    filtered: visibleCourses,
    isSearching,
  } = useSearch(courses, (course) =>
    [course.subject?.name, course.subject?.description].join(' ')
  );
  const { data: subjects } = useSubjects();

  const createMutation = useCreateCourse();
  const deleteMutation = useDeleteCourse();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const availableSubjects = useMemo(() => {
    const usedSubjectIds = new Set(courses?.map((course) => course.subjectId));
    return subjects?.filter((subject) => !usedSubjectIds.has(subject.id)) || [];
  }, [courses, subjects]);

  const courseFields = useMemo(
    () => [
      {
        name: 'subjectId',
        label: 'Materia',
        type: 'select',
        placeholder: 'Seleccione una materia...',
        required: true,
        options: availableSubjects.map((subject) => ({
          value: subject.id,
          label: subject.name,
        })),
      },
    ],
    [availableSubjects]
  );

  const loading = !me || isLoading;

  const handleOpenDelete = (course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleModalOpenChange = (isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) createMutation.reset();
  };

  const handleSubmit = (formData) => {
    createMutation.mutate(
      { subjectId: Number(formData.subjectId) },
      {
        onSuccess: (newCourse) => {
          setIsModalOpen(false);
          createMutation.reset();
          navigate(`/my-courses/${newCourse.id}`);
        },
      }
    );
  };

  const handleDeleteSubmit = () => {
    if (!selectedCourse) return;
    deleteMutation.mutate(selectedCourse.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        deleteMutation.reset();
        setSelectedCourse(null);
      },
    });
  };

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar tus cursos.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis cursos</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={loading || availableSubjects.length === 0}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Curso
        </Button>
      </div>

      {loading ? (
        <GetSkeleton />
      ) : (
        <>
          {courses?.length > 0 && (
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Buscar cursos..."
              noResults={isSearching && visibleCourses.length === 0}
            />
          )}
          {courses?.length === 0 && (
            <p className="text-slate-400">
              Todavía no creaste ningún curso. Elegí una materia para empezar a
              cargar tus tarjetas y resúmenes.
            </p>
          )}

          {courses?.length > 0 && availableSubjects.length === 0 && (
            <p className="text-slate-400 mb-4">
              Ya tenés un curso en todas las materias disponibles.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCourses?.map((course) => (
              <Card
                key={course.id}
                className="flex flex-col justify-between relative"
              >
                <div className="absolute right-0 top-0 z-10 flex gap-2 p-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(course)}
                    className="cursor-pointer"
                    aria-label="Eliminar curso"
                    title="Eliminar curso"
                  >
                    <X />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle className="mr-10">
                    {course.subject?.name || `Curso ${course.id}`}
                  </CardTitle>
                  {course.subject?.description && (
                    <CardDescription>
                      {course.subject.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardFooter>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/my-courses/${course.id}`)}
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <FolderOpen />
                    Abrir curso
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <FormModal
            key="create-course"
            open={isModalOpen}
            onOpenChange={handleModalOpenChange}
            title="Nuevo Curso"
            fields={courseFields}
            schema={courseSchema}
            onSubmit={handleSubmit}
            error={createMutation.error}
            isLoading={createMutation.isPending}
          />

          <FormModal
            key={
              isDeleteModalOpen
                ? `delete-${selectedCourse?.id}`
                : 'delete-closed'
            }
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => {
              setIsDeleteModalOpen(isOpen);
              if (!isOpen) {
                deleteMutation.reset();
                setSelectedCourse(null);
              }
            }}
            title={`¿Deseas eliminar tu curso "${selectedCourse?.subject?.name}"? Tu contenido se conserva y vuelve a estar disponible si lo creás de nuevo.`}
            fields={[]}
            onSubmit={handleDeleteSubmit}
            error={deleteMutation.error}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default MyCourses;
