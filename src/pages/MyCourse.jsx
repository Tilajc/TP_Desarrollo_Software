import { useNavigate, useParams } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { useCourse } from '@/hooks/useCourses';
import { useTopics } from '@/hooks/useTopics';
import { useGetMe } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

const MyCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data: me } = useGetMe();
  const { data: course, isLoading, isError } = useCourse(courseId);
  const { data: topics, isLoading: topicsLoading } = useTopics(
    course?.subjectId,
    !!course
  );

  if (isError)
    return <p className="p-4 text-red-500">No se encontró el curso.</p>;

  if (isLoading || !me) return <GetSkeleton />;

  if (course.authorId !== me.id)
    return <p className="p-4 text-red-500">No tenés acceso a este curso.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/my-courses')}
        className="cursor-pointer mb-4"
      >
        ← Volver a Mis cursos
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{course.subject?.name}</h1>
        {course.subject?.description && (
          <p className="text-slate-400 mt-1">{course.subject.description}</p>
        )}
        {course.courseSubscriptions && (
          <p className="text-xs text-slate-500 mt-2">
            {course.courseSubscriptions.length === 1
              ? '1 suscriptor'
              : `${course.courseSubscriptions.length} suscriptores`}
          </p>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Temas</h2>

      {topicsLoading ? (
        <GetSkeleton />
      ) : (
        <>
          {topics?.length === 0 && (
            <p className="text-slate-400">
              Esta materia todavía no tiene temas. Los temas los carga un
              administrador; cuando estén, vas a poder cargar tu contenido acá.
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
                      navigate(`/my-courses/${course.id}/topics/${topic.id}`)
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

export default MyCourse;
