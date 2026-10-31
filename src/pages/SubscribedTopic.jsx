import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lightbulb, GraduationCap } from 'lucide-react';
import { useGetMe } from '@/hooks/useAuth';
import { useCourse } from '@/hooks/useCourses';
import { useCourseSubscriptions } from '@/hooks/useCourseSubscriptions';
import { useTopic } from '@/hooks/useTopics';
import { useCards } from '@/hooks/useCards';
import { useSummaries } from '@/hooks/useSummaries';
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

const CardsList = ({ topicId, authorId }) => {
  const { data: cards, isLoading, isError } = useCards(topicId, { authorId });
  const {
    query,
    setQuery,
    filtered: visibleCards,
    isSearching,
  } = useSearch(cards, (card) =>
    [
      card.question,
      card.answer,
      ...(card.hints?.map((hint) => hint.content) ?? []),
    ].join(' ')
  );

  if (isError)
    return <p className="text-red-500">Error al cargar las tarjetas.</p>;
  if (isLoading) return <GetSkeleton />;

  return (
    <>
      {cards?.length > 0 && (
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar tarjetas..."
          noResults={isSearching && visibleCards.length === 0}
        />
      )}
      {cards?.length === 0 && (
        <p className="text-slate-400">
          El autor todavía no cargó tarjetas en este tema.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleCards?.map((card) => {
          const cardHint = card.hints?.[0];

          return (
            <Card key={card.id} className="h-auto min-h-47.5">
              <CardHeader className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg font-bold leading-snug wrap-break-words">
                    {card.question}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed wrap-break-words whitespace-normal text-slate-600 dark:text-slate-300">
                    {card.answer}
                  </CardDescription>
                </div>

                {cardHint && (
                  <div className="mt-4 flex items-start gap-2 text-xs bg-sky-50 border border-sky-200 text-sky-900 px-3 py-2.5 rounded-lg">
                    <Lightbulb className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                    <div className="leading-relaxed wrap-break-words whitespace-normal">
                      <strong className="font-semibold text-sky-950 mr-1">
                        Pista:
                      </strong>
                      {cardHint.content}
                    </div>
                  </div>
                )}
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </>
  );
};

const SummariesList = ({ topicId, authorId }) => {
  const {
    data: summaries,
    isLoading,
    isError,
  } = useSummaries(topicId, { authorId });
  const {
    query,
    setQuery,
    filtered: visibleSummaries,
    isSearching,
  } = useSearch(summaries, (summary) =>
    [summary.title, summary.content].join(' ')
  );

  if (isError)
    return <p className="text-red-500">Error al cargar los resúmenes.</p>;
  if (isLoading) return <GetSkeleton />;

  return (
    <>
      {summaries?.length > 0 && (
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar resúmenes..."
          noResults={isSearching && visibleSummaries.length === 0}
        />
      )}
      {summaries?.length === 0 && (
        <p className="text-slate-400">
          El autor todavía no cargó resúmenes en este tema.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleSummaries?.map((summary) => (
          <Card key={summary.id} className="h-auto min-h-47.5">
            <CardHeader className="p-5">
              <CardTitle className="text-lg font-bold leading-snug wrap-break-words">
                {summary.title}
              </CardTitle>
              {summary.date && (
                <p className="text-xs text-slate-500">
                  {new Date(summary.date).toLocaleDateString('es-AR')}
                </p>
              )}
              <CardDescription className="text-sm leading-relaxed wrap-break-words whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                {summary.content}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
};

const SubscribedTopic = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState('cards');

  const { data: me } = useGetMe();
  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
  } = useCourse(courseId);
  const { data: subscriptions, isLoading: subscriptionsLoading } =
    useCourseSubscriptions();
  const {
    data: topic,
    isLoading: topicLoading,
    isError: topicError,
  } = useTopic(topicId);

  if (courseError || topicError)
    return <p className="p-4 text-red-500">No se encontró el tema.</p>;

  if (courseLoading || subscriptionsLoading || topicLoading || !me)
    return <GetSkeleton />;

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

  const isSubscribed = subscriptions?.some(
    (subscription) => subscription.courseId === course.id
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

  if (topic.subjectId !== course.subjectId)
    return (
      <p className="p-4 text-red-500">
        Este tema no pertenece a la materia del curso.
      </p>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/subscriptions/${courseId}`)}
        className="cursor-pointer mb-4"
      >
        ← Volver al curso
      </Button>

      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{topic.name}</h1>
          <p className="text-slate-400 mt-1">
            {course.subject?.name} · Autor: {course.author?.name}{' '}
            {course.author?.lastName}
          </p>
        </div>
        <Button
          onClick={() =>
            navigate(
              `/subjects/${course.subjectId}/topics/${topicId}/cards?authorId=${course.authorId}`
            )
          }
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          <GraduationCap />
          Estudiar tarjetas
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={tab === 'cards' ? 'default' : 'outline'}
          onClick={() => setTab('cards')}
          className={
            tab === 'cards'
              ? 'cursor-pointer bg-blue-500 hover:bg-blue-600 text-white'
              : 'cursor-pointer text-black'
          }
        >
          Tarjetas
        </Button>
        <Button
          variant={tab === 'summaries' ? 'default' : 'outline'}
          onClick={() => setTab('summaries')}
          className={
            tab === 'summaries'
              ? 'cursor-pointer bg-blue-500 hover:bg-blue-600 text-white'
              : 'cursor-pointer text-black'
          }
        >
          Resúmenes
        </Button>
      </div>

      {tab === 'cards' ? (
        <CardsList topicId={topicId} authorId={course.authorId} />
      ) : (
        <SummariesList topicId={topicId} authorId={course.authorId} />
      )}
    </div>
  );
};

export default SubscribedTopic;
