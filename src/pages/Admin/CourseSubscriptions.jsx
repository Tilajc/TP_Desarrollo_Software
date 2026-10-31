import { useState } from 'react';
import { Pencil, X, GraduationCap } from 'lucide-react';
import {
  useCourseSubscriptions,
  useCreateCourseSubscription,
  useUpdateCourseSubscription,
  useDeleteCourseSubscription,
} from '../../hooks/useCourseSubscriptions';
import FormModal from '../../components/FormModal';
import { courseSubscriptionSchema } from '../../schemas/courseSubscription';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';
import SearchInput from '@/components/SearchInput';
import useSearch from '@/hooks/useSearch';

const SUBSCRIPTION_FIELDS = [
  {
    name: 'courseId',
    label: 'ID del Curso (Course)',
    placeholder: 'Ej: 2',
    type: 'number',
    required: true,
  },
  {
    name: 'subscriberId',
    label: 'ID del Suscriptor (User)',
    placeholder: 'Vacío = el usuario logueado',
    type: 'number',
    required: false,
  },
];

const CourseSubscriptions = () => {
  const { data: subscriptions, isLoading, isError } = useCourseSubscriptions();
  const {
    query,
    setQuery,
    filtered: visibleSubscriptions,
    isSearching,
  } = useSearch(subscriptions, (sub) =>
    [
      sub.id,
      sub.courseId,
      sub.subscriberId,
      sub.subscriber?.name,
      sub.subscriber?.lastName,
      sub.subscriber?.email,
      sub.course?.subject?.name,
    ].join(' ')
  );
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

  const handleModalOpenChange = (isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      createMutation.reset();
      updateMutation.reset();
      setSelectedSub(null);
    }
  };

  const handleSubmit = (formData) => {
    const payload = {
      courseId: Number(formData.courseId),
      ...(formData.subscriberId && {
        subscriberId: Number(formData.subscriberId),
      }),
    };

    if (selectedSub) {
      updateMutation.mutate(
        { id: selectedSub.id, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            updateMutation.reset();
            setSelectedSub(null);
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
    if (!selectedSub) return;
    deleteMutation.mutate(selectedSub.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        deleteMutation.reset();
        setSelectedSub(null);
      },
    });
  };

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Error al cargar las suscripciones a cursos.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-indigo-400" />
            Suscripciones a Cursos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de suscripciones de usuarios por curso
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Nueva Suscripción
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          {subscriptions?.length > 0 && (
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Buscar suscripciones..."
              noResults={isSearching && visibleSubscriptions.length === 0}
            />
          )}
          {subscriptions?.length === 0 && (
            <p className="text-slate-400">
              No hay suscripciones registradas todavía.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleSubscriptions?.map((sub) => (
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
                    aria-label="Editar suscripción"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(sub)}
                    className="cursor-pointer"
                    aria-label="Eliminar suscripción"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <CardHeader>
                  <CardTitle className="text-base font-semibold mr-16">
                    Suscripción #{sub.id}
                  </CardTitle>
                  <CardDescription className="space-y-1 mt-2 text-xs text-slate-300">
                    <p>
                      <strong>ID Curso:</strong> {sub.courseId}
                    </p>
                    <p>
                      <strong>ID Suscriptor:</strong> {sub.subscriberId}
                    </p>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <FormModal
            key={selectedSub ? `edit-${selectedSub.id}` : 'create-subscription'}
            open={isModalOpen}
            onOpenChange={handleModalOpenChange}
            title={
              selectedSub ? 'Editar Suscripción' : 'Nueva Suscripción a Curso'
            }
            fields={SUBSCRIPTION_FIELDS}
            initialData={selectedSub}
            schema={courseSubscriptionSchema}
            onSubmit={handleSubmit}
            error={createMutation.error || updateMutation.error}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={
              isDeleteModalOpen ? `delete-${selectedSub?.id}` : 'delete-closed'
            }
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => {
              setIsDeleteModalOpen(isOpen);
              if (!isOpen) setSelectedSub(null);
            }}
            title={`¿Deseas dar de baja la suscripción #${selectedSub?.id}?`}
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
