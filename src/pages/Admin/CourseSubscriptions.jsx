import { useState } from 'react';
import { Pencil, X, GraduationCap } from 'lucide-react';
import {
  useCourseSubscriptions,
  useCreateCourseSubscription,
  useUpdateCourseSubscription,
  useDeleteCourseSubscription,
} from '../../hooks/useCourseSubscriptions';
import FormModal from '../../components/FormModal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

const SUBSCRIPTION_FIELDS = [
  {
    name: 'courseId',
    label: 'ID del Curso (Course)',
    placeholder: 'Ej: 2',
    type: 'number',
    required: true,
  },
  {
    name: 'studentId',
    label: 'ID del Alumno (Student)',
    placeholder: 'Ej: 11',
    type: 'number',
    required: true,
  },
  {
    name: 'status',
    label: 'Estado de Inscripción',
    placeholder: 'CURSANDO',
    type: 'text',
    required: true,
  },
];

const CourseSubscriptions = () => {
  const { data: subscriptions, isLoading, isError } = useCourseSubscriptions();
  const createMutation = useCreateCourseSubscription();
  const updateMutation = useUpdateCourseSubscription();
  const deleteMutation = useDeleteCourseSubscription();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  const handleOpenCreate = () => {
    setSelectedSub(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (sub) => {
    setSelectedSub(sub);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const payload = {
      ...formData,
      courseId: Number(formData.courseId),
      studentId: Number(formData.studentId),
    };

    if (selectedSub) {
      updateMutation.mutate(
        { id: selectedSub.id, data: payload },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedSub) return;
    deleteMutation.mutate(selectedSub.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Error al cargar las inscripciones a cursos.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-indigo-400" />
            Inscripciones a Cursos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de suscripciones de alumnos por curso
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Inscribir Alumno
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          {subscriptions?.length === 0 && (
            <p className="text-slate-400">
              No hay inscripciones registradas todavía.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions?.map((sub) => (
              <Card
                key={sub.id}
                className="flex flex-col justify-between relative"
              >
                <div className="absolute right-0 top-0 z-10 flex gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(sub)}
                    className="cursor-pointer"
                    aria-label="Editar inscripción"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(sub)}
                    className="cursor-pointer"
                    aria-label="Eliminar inscripción"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <CardHeader>
                  <CardTitle className="text-base font-semibold mr-16">
                    Inscripción #{sub.id}
                  </CardTitle>
                  <CardDescription className="space-y-1 mt-2 text-xs text-slate-300">
                    <p>
                      <strong>ID Curso:</strong> {sub.courseId || sub.classId}
                    </p>
                    <p>
                      <strong>ID Alumno:</strong> {sub.studentId}
                    </p>
                    <div className="pt-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        {sub.status || 'CURSANDO'}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <FormModal
            key={selectedSub ? `edit-${selectedSub.id}` : 'create-subscription'}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title={
              selectedSub ? 'Editar Inscripción' : 'Nueva Inscripción a Curso'
            }
            fields={SUBSCRIPTION_FIELDS}
            initialData={selectedSub}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={
              selectedSub ? `delete-${selectedSub.id}` : 'delete-subscription'
            }
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title={`¿Deseas dar de baja la inscripción #${selectedSub?.id}?`}
            fields={[]}
            onSubmit={handleDeleteSubmit}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default CourseSubscriptions;
