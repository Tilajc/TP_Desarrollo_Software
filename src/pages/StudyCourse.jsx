import { useState, useMemo } from 'react';
import {
  Layers,
  BookOpen,
  Lightbulb,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ListTree,
} from 'lucide-react';
import { useCourseSubscriptions } from '@/hooks/useCourseSubscriptions';
import { useTopics } from '@/hooks/useTopics';
import { useCards } from '@/hooks/useCards';
import { useSummaries } from '@/hooks/useSummaries';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

const FlashcardPlayer = ({ cards = [], onBack }) => {
  const cardsList = useMemo(() => {
    if (Array.isArray(cards)) return cards;
    if (cards && Array.isArray(cards.data)) return cards.data;
    if (cards && Array.isArray(cards.cards)) return cards.cards;
    return [];
  }, [cards]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (cardsList.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto bg-[#0f1422] border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
        <h2 className="text-white text-lg font-medium">
          No hay tarjetas disponibles
        </h2>
        <p className="text-sm text-slate-400">
          Este tema todavía no cuenta con tarjetas creadas para estudiar.
        </p>
        <Button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          Volver a temas
        </Button>
      </div>
    );
  }

  const currentCard = cardsList[currentIndex];
  const currentHint = currentCard?.hints?.[0]?.content || currentCard?.hint;

  const handleNext = () => {
    setShowAnswer(false);
    setShowHint(false);

    if (currentIndex + 1 < cardsList.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setShowAnswer(false);
      setShowHint(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setShowHint(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-lg mx-auto bg-[#0f1422] border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-white">
          ¡Completaste todas las tarjetas!
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Repasaste las {cardsList.length} tarjetas de esta sesión de estudio.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={handleRestart}
            className="inline-flex items-center gap-2 cursor-pointer border-slate-700 bg-slate-800 text-white hover:bg-slate-700 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" /> Repasar de nuevo
          </Button>
          <Button
            onClick={onBack}
            className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            Volver a temas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="border-b border-slate-800 pb-4 mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-slate-400 hover:text-white -ml-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver
        </Button>
        <h2 className="text-white text-sm font-medium">Estudiando</h2>
        <div className="w-16" />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-medium px-1">
        <span>
          Tarjeta {currentIndex + 1} de {cardsList.length}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrevious}
            className="disabled:opacity-30 hover:text-slate-200 cursor-pointer transition-colors"
            aria-label="Tarjeta anterior"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="hover:text-slate-200 cursor-pointer transition-colors"
            aria-label="Siguiente tarjeta"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        onClick={() => setShowAnswer(!showAnswer)}
        className="w-full min-h-[14rem] bg-[#0b0f19]/80 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/40 transition-all select-none group shadow-inner"
      >
        {!showAnswer ? (
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
              Pregunta
            </span>
            <p className="text-base text-white font-medium px-2">
              {currentCard?.question}
            </p>
            <p className="text-xs text-slate-600 italic pt-6 group-hover:text-slate-500 transition-colors">
              Click para voltear
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Respuesta
            </span>
            <p className="text-sm text-slate-300 leading-relaxed px-2">
              {currentCard?.answer}
            </p>
            <p className="text-xs text-slate-600 italic pt-6 group-hover:text-slate-500 transition-colors">
              Click para volver a la pregunta
            </p>
          </div>
        )}
      </div>

      {currentHint && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Pista</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showHint ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showHint && (
            <div className="mt-2.5 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-150 flex items-start gap-2.5">
              <span className="text-amber-400 font-semibold select-none">
                💡
              </span>
              <p>{currentHint}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 mt-6">
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/50 hover:border-rose-800 text-rose-300 rounded-xl text-xs font-medium transition-all shadow-sm cursor-pointer"
        >
          No lo sabía
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-2.5 px-3 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-900/40 hover:border-amber-800 text-amber-300 rounded-xl text-xs font-medium transition-all shadow-sm cursor-pointer"
        >
          Dudé
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-2.5 px-3 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-900/50 hover:border-emerald-800 text-emerald-300 rounded-xl text-xs font-medium transition-all shadow-sm cursor-pointer"
        >
          Lo sabía
        </button>
      </div>
    </div>
  );
};

const SummariesViewer = ({ summaries }) => {
  if (!summaries || summaries.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-[#0c1017] max-w-2xl mx-auto">
        <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-400 font-medium">
          Este tema todavía no tiene resúmenes cargados por el docente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {summaries.map((summary) => (
        <div
          key={summary.id}
          className="p-6 rounded-2xl bg-[#0c1017] border border-slate-800/80 shadow-md space-y-3"
        >
          <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
            {summary.title}
          </h3>
          {summary.createdAt && (
            <p className="text-xs text-slate-500 font-medium">
              {new Date(summary.createdAt).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
            {summary.content}
          </p>
        </div>
      ))}
    </div>
  );
};

const StudyCourse = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [mode, setMode] = useState('cards');

  const { data: subscriptions, isLoading: subsLoading } =
    useCourseSubscriptions();

  const subjects = useMemo(() => {
    if (!subscriptions) return [];
    const map = new Map();
    subscriptions.forEach((sub) => {
      const subject = sub.course?.subject;
      if (subject && !map.has(subject.id)) {
        map.set(subject.id, subject);
      }
    });
    return Array.from(map.values());
  }, [subscriptions]);

  const filteredCourses = useMemo(() => {
    if (!subscriptions || !selectedSubjectId) return [];
    return subscriptions
      .filter((sub) => sub.course?.subjectId === Number(selectedSubjectId))
      .map((sub) => sub.course);
  }, [subscriptions, selectedSubjectId]);

  const { data: topics, isLoading: topicsLoading } = useTopics(
    selectedCourse?.subjectId,
    !!selectedCourse
  );

  const { data: cards, isLoading: cardsLoading } = useCards(
    selectedTopic?.id,
    { authorId: selectedCourse?.authorId },
    !!selectedTopic
  );

  const { data: summaries, isLoading: summariesLoading } = useSummaries(
    selectedTopic?.id,
    { authorId: selectedCourse?.authorId },
    !!selectedTopic
  );

  if (subsLoading) return <GetSkeleton />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {!selectedTopic && selectedCourse && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedCourse(null)}
          className="cursor-pointer mb-4 text-slate-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver a cursos
        </Button>
      )}

      {!selectedTopic && !selectedCourse && selectedSubjectId && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedSubjectId(null)}
          className="cursor-pointer mb-4 text-slate-400 hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver a materias
        </Button>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">
          {selectedTopic
            ? selectedTopic.name
            : selectedCourse
              ? selectedCourse.subject?.name
              : selectedSubjectId
                ? 'Cursos'
                : 'Materias'}
        </h1>
      </div>

      {!selectedSubjectId && (
        <>
          {subjects.length === 0 ? (
            <p className="p-4 text-slate-400">
              Todavía no estás inscripto en ningún curso.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <Card
                  key={subject.id}
                  className="flex flex-col justify-between relative"
                >
                  <CardHeader>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>
                      {subject.description || 'Sin descripción'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      size="sm"
                      onClick={() => setSelectedSubjectId(subject.id)}
                      className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <ListTree className="w-4 h-4 mr-1" />
                      Cursos
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {selectedSubjectId && !selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col justify-between relative"
            >
              <CardHeader>
                <CardTitle>{course.subject?.name}</CardTitle>
                <CardDescription>
                  Docente: {course.author?.name} {course.author?.lastName}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <Button
                  size="sm"
                  onClick={() => setSelectedCourse(course)}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <ListTree className="w-4 h-4 mr-1" />
                  Abrir curso
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedCourse && !selectedTopic && (
        <>
          {topicsLoading ? (
            <GetSkeleton />
          ) : topics?.length === 0 ? (
            <p className="p-4 text-slate-400">
              Esta materia todavía no tiene temas creados.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics?.map((topic) => (
                <Card
                  key={topic.id}
                  className="flex flex-col justify-between relative"
                >
                  <CardHeader>
                    <CardTitle>{topic.name}</CardTitle>
                    <CardDescription>
                      Tema disponible para estudiar
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTopic(topic);
                        setMode('cards');
                      }}
                      className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <ListTree className="w-4 h-4 mr-1" />
                      Temas
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {selectedTopic && (
        <div className="space-y-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode('cards')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                mode === 'cards'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Layers className="w-4 h-4" /> Tarjetas
            </button>
            <button
              type="button"
              onClick={() => setMode('summaries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                mode === 'summaries'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Resúmenes
            </button>
          </div>

          {mode === 'cards' ? (
            cardsLoading ? (
              <GetSkeleton />
            ) : (
              <FlashcardPlayer
                cards={cards}
                onBack={() => setSelectedTopic(null)}
              />
            )
          ) : summariesLoading ? (
            <GetSkeleton />
          ) : (
            <SummariesViewer summaries={summaries} />
          )}
        </div>
      )}
    </div>
  );
};

export default StudyCourse;
