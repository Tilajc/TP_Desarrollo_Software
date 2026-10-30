import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import {
  useCourseSubscriptions,
  useCreateCourseSubscription,
  useDeleteCourseSubscription,
} from '@/hooks/useCourseSubscriptions';
import { useGetMe } from '@/hooks/useAuth';
import FormModal from '@/components/FormModal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

const authorName = (course) =>
  course.author
    ? `${course.author.name} ${course.author.lastName}`
    : 'Autor desconocido';

const subscribersText = (count = 0) =>
  count === 1 ? '1 suscriptor' : `${count} suscriptores`;

const Subscriptions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState('explore');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const { data: me } = useGetMe();
  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
  } = useCourses();
  const {
    data: subscriptions,
    isLoading: subscriptionsLoading,
    isError: subscriptionsError,
  } = useCourseSubscriptions();

  const createMutation = useCreateCourseSubscription();
  const deleteMutation = useDeleteCourseSubscription();

  const subscribedCourseIds = useMemo(
    () => new Set(subscriptions?.map((subscription) => subscription.courseId)),
    [subscriptions]
  );

  const catalog = useMemo(
    () => courses?.filter((course) => course.authorId !== me?.id) || [],
    [courses, me]
  );
  const isSubscribing = (courseId) =>
    createMutation.isPending && createMutation.variables?.courseId === courseId;

  const handleChangeTab = (newTab) => {
    setTab(newTab);
    createMutation.reset();
  };

  const handleSubscribe = (course) => {
    createMutation.mutate(
      { courseId: course.id },
      {
        onSuccess: () => {
          createMutation.reset();
          queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
      }
    );
  };

  const handleOpenDelete = (subscription) => {
    setSelectedSubscription(subscription);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = () => {
    if (!selectedSubscription) return;
    deleteMutation.mutate(selectedSubscription.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        deleteMutation.reset();
        setSelectedSubscription(null);
        queryClient.invalidateQueries({ queryKey: ['courses'] });
      },
    });
  };

  if (coursesError || subscriptionsError)
    return <p className="p-4 text-red-500">Error al cargar los cursos.</p>;

  const loading = !me || coursesLoading || subscriptionsLoading;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Suscripciones</h1>

      <div className="flex gap-2 mb-6">
        <Button
          variant={tab === 'explore' ? 'default' : 'outline'}
          onClick={() => handleChangeTab('explore')}
          className={
            tab === 'explore'
              ? 'cursor-pointer bg-blue-500 hover:bg-blue-600 text-white'
              : 'cursor-pointer text-black'
          }
        >
          Explorar
        </Button>
        <Button
          variant={tab === 'mine' ? 'default' : 'outline'}
          onClick={() => handleChangeTab('mine')}
          className={
            tab === 'mine'
              ? 'cursor-pointer bg-blue-500 hover:bg-blue-600 text-white'
              : 'cursor-pointer text-black'
          }
        >
          Mis suscripciones{subscriptions ? ` (${subscriptions.length})` : ''}
        </Button>
      </div>

      {loading ? (
        <GetSkeleton />
      ) : tab === 'explore' ? (
        <>
          <div className="flex items-center gap-3 mb-4"></div>

          {createMutation.error && (
            <p className="text-sm text-red-700 mb-4">
              {createMutation.error.message}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map((course) => {
              const subscribed = subscribedCourseIds.has(course.id);

              return (
                <Card key={course.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>
                      {course.subject?.name || `Curso ${course.id}`}
                    </CardTitle>
                    <CardDescription>
                      <span className="block">Autor: {authorName(course)}</span>
                      <span className="block text-xs">
                        {subscribersText(course._count?.courseSubscriptions)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    {subscribed ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/subscriptions/${course.id}`)}
                        className="cursor-pointer"
                      >
                        <BookOpen />
                        Suscripto · Abrir
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleSubscribe(course)}
                        disabled={isSubscribing(course.id)}
                        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {isSubscribing(course.id)
                          ? 'Suscribiendo...'
                          : 'Suscribirme'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {subscriptions?.length === 0 && (
            <p className="text-slate-400">
              Todavía no te suscribiste a ningún curso. Mirá la pestaña Explorar
              para encontrar uno.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions?.map((subscription) => (
              <Card
                key={subscription.id}
                className="flex flex-col justify-between"
              >
                <CardHeader>
                  <CardTitle>
                    {subscription.course?.subject?.name ||
                      `Curso ${subscription.courseId}`}
                  </CardTitle>
                  <CardDescription>
                    Autor:{' '}
                    {subscription.course
                      ? authorName(subscription.course)
                      : 'Autor desconocido'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/subscriptions/${subscription.courseId}`)
                    }
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <BookOpen />
                    Abrir
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDelete(subscription)}
                    className="cursor-pointer"
                  >
                    Darme de baja
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      <FormModal
        key={
          isDeleteModalOpen
            ? `delete-${selectedSubscription?.id}`
            : 'delete-closed'
        }
        open={isDeleteModalOpen}
        onOpenChange={(isOpen) => {
          setIsDeleteModalOpen(isOpen);
          if (!isOpen) {
            deleteMutation.reset();
            setSelectedSubscription(null);
          }
        }}
        title={`¿Deseas darte de baja del curso "${selectedSubscription?.course?.subject?.name}"?`}
        fields={[]}
        onSubmit={handleDeleteSubmit}
        error={deleteMutation.error}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Subscriptions;
