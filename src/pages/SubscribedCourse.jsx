import { useNavigate, useParams } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useCourseSubscriptions } from '@/hooks/useCourseSubscriptions';
import { useTopics } from '@/hooks/useTopics';
import { useGetMe } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

const SubscribedCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: me } = useGetMe();
  const { data: course, isLoading, isError } = useCourse(courseId);
  const { data: subscriptions, isLoading: subscriptionsLoading } =
    useCourseSubscriptions();

  const isSubscribed = !!subscriptions?.some(
    (subscription) => subscription.courseId === Number(courseId)
  );

  const { data: topics, isLoading: topicsLoading } = useTopics(
    course?.subjectId,
    !!course && isSubscribed
  );

  if (isError)
    return <p className="p-4 text-red-500">No se encontró el curso.</p>;

  if (isLoading || subscriptionsLoading || !me) return <GetSkeleton />;

  if (course.authorId === me.id)
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <p className="text-slate-400 mb-4">Este curso es tuyo.</p>
        <Button
          onClick={() => navigate(`/my-courses/${course.id}`)}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          Ir a Mis cursos
        </Button>
      </div>
    );

  if (!isSubscribed)
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <p className="text-red-500 mb-4">No estás suscripto a este curso.</p>
        <Button
          onClick={() => navigate('/subscriptions')}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          Explorar cursos
        </Button>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/subscriptions')}
        className="cursor-pointer mb-4"
      >
        ← Volver a Suscripciones
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{course.subject?.name}</h1>
        <p className="text-slate-400 mt-1">
          Autor: {course.author?.name} {course.author?.lastName}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Temas</h2>

      {topicsLoading ? (
        <GetSkeleton />
      ) : (
        <>
          {topics?.length === 0 && (
            <p className="text-slate-400">
              Esta materia todavía no tiene temas cargados.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics?.map((topic) => (
              <Card key={topic.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>{topic.name}</CardTitle>
                </CardHeader>
                <CardFooter>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/subscriptions/${course.id}/topics/${topic.id}`)
                    }
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Layers />
                    Abrir tema
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SubscribedCourse;
