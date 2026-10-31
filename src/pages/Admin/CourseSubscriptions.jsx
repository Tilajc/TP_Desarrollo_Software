import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pencil, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useCourseSubscriptions,
  useCreateCourseSubscription,
  useUpdateCourseSubscription,
  useDeleteCourseSubscription,
} from '../../hooks/useCourseSubscriptions';
import { useCourse } from '../../hooks/useCourses';
import { useUsers } from '../../hooks/useUsers';
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

const SUBSCRIPTION_SCHEMA = courseSubscriptionSchema.pick({
  subscriberId: true,
});

const CourseSubscriptions = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: course } = useCourse(courseId);
  const { data: users } = useUsers();
  const {
    data: subscriptions,
    isLoading,
    isError,
  } = useCourseSubscriptions(courseId);
  const {
    query,
    setQuery,
    filtered: visibleSubscriptions,
    isSearching,
  } = useSearch(subscriptions, (sub) =>
    [
      sub.id,
      sub.subscriberId,
      sub.subscriber?.name,
      sub.subscriber?.lastName,
      sub.subscriber?.email,
    ].join(' ')
  );
  const createMutation = useCreateCourseSubscription();
  const updateMutation = useUpdateCourseSubscription();
  const deleteMutation = useDeleteCourseSubscription();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  const subscriptionFields = useMemo(() => {
    const subscribedIds = new Set(
      subscriptions?.map((sub) => sub.subscriberId)
    );

    return [
      {
        name: 'subscriberId',
        label: 'Usuario',
        type: 'select',
        placeholder: 'Seleccione un usuario...',
        required: true,
        options: (users || [])
          .filter(
            (user) =>
              user.id !== course?.authorId &&
              (!subscribedIds.has(user.id) ||
                user.id === selectedSub?.subscriberId)
          )
          .map((user) => ({
            value: user.id,
            label: `${user.name} ${user.lastName} (${user.email})`,
          })),
      },
    ];
  }, [users, subscriptions, course, selectedSub]);

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
      courseId: Number(courseId),
      subscriberId: Number(formData.subscriberId),
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

  const subscriberName = (sub) =>
    sub?.subscriber
      ? `${sub.subscriber.name} ${sub.subscriber.lastName}`
      : `Usuario #${sub?.subscriberId}`;

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Error al cargar las suscripciones a cursos.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/courses`)}
        className="cursor-pointer mb-4"
      >
        ← Volver a Cursos
      </Button>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Suscripciones a {course.subject.name} de {course.author?.name}
          </h1>
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
              Este curso todavía no tiene suscripciones.
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
                      <strong>Suscriptor:</strong> {subscriberName(sub)}
                    </p>
                    {sub.subscriber?.email && (
                      <p>
                        <strong>Email:</strong> {sub.subscriber.email}
                      </p>
                    )}
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
            fields={subscriptionFields}
            initialData={selectedSub}
            schema={SUBSCRIPTION_SCHEMA}
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
            title={`¿Deseas dar de baja la suscripción de ${subscriberName(selectedSub)}?`}
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
