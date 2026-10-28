import { useState, useMemo } from 'react';
import {
  Layers,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  Eye,
  GraduationCap,
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
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

// --- VISOR Y RESPUESTA DE TARJETAS ---
const FlashcardPlayer = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState({ correct: 0, review: 0 });
  const [finished, setFinished] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <p className="text-slate-400 py-6">
        Este tema todavía no tiene tarjetas cargadas por el docente.
      </p>
    );
  }

  const currentCard = cards[currentIndex];
  const hint = currentCard?.hints?.[0]?.content;

  const handleNext = (known) => {
    setScore((prev) => ({
      correct: known ? prev.correct + 1 : prev.correct,
      review: !known ? prev.review + 1 : prev.review,
    }));

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      setShowHint(false);
      setUserAnswer('');
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setShowHint(false);
    setUserAnswer('');
    setScore({ correct: 0, review: 0 });
    setFinished(false);
  };

  if (finished) {
    return (
      <Card className="max-w-lg mx-auto text-center p-6 border-slate-800">
        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-2xl font-bold text-white mb-2">
          ¡Repaso finalizado!
        </h3>
        <p className="text-slate-400 text-sm mb-6">
          Completaste las {cards.length} tarjetas de este tema.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl">
            <span className="text-3xl font-bold text-emerald-400">
              {score.correct}
            </span>
            <p className="text-xs text-emerald-300 mt-1">Aprendidas</p>
          </div>
          <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl">
            <span className="text-3xl font-bold text-amber-400">
              {score.review}
            </span>
            <p className="text-xs text-amber-300 mt-1">Para repasar</p>
          </div>
        </div>

        <Button
          onClick={handleRestart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Volver a repasar
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center text-xs text-slate-400 px-1">
        <span>
          Tarjeta {currentIndex + 1} de {cards.length}
        </span>
        <span className="space-x-3">
          <span className="text-emerald-400">Sabidas: {score.correct}</span>
          <span className="text-amber-400">Repasar: {score.review}</span>
        </span>
      </div>

      <Card className="min-h-75 flex flex-col justify-between">
        <CardHeader>
          <span className="text-xs font-semibold tracking-wider text-blue-500 uppercase">
            Pregunta
          </span>
          <CardTitle className="text-xl font-bold mt-1 leading-snug">
            {currentCard.question}
          </CardTitle>

          {hint && (
            <div className="mt-3">
              {showHint ? (
                <div className="flex items-start gap-2 text-xs bg-sky-950/30 border border-sky-800 text-sky-200 px-3 py-2 rounded-lg">
                  <Lightbulb className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
                  <div>
                    <strong className="text-sky-300">Pista:</strong> {hint}
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="text-xs text-sky-400 hover:text-sky-300 h-7 px-2 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 mr-1" /> Ver pista
                </Button>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {!showAnswer && (
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">
                Tu respuesta (opcional):
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Escribí lo que recuerdes antes de comprobar..."
                className="w-full p-3 text-sm bg-slate-900/50 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none h-20"
              />
            </div>
          )}

          {showAnswer && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-1.5">
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Respuesta
              </span>
              <p className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
                {currentCard.answer}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t border-slate-800/60 flex gap-3">
          {!showAnswer ? (
            <Button
              onClick={() => setShowAnswer(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" /> Mostrar Respuesta
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleNext(false)}
                className="w-1/2 border-amber-600/50 text-amber-400 hover:bg-amber-950/30 cursor-pointer"
              >
                Necesito repasar
              </Button>
              <Button
                onClick={() => handleNext(true)}
                className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                ¡La sabía!
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

// --- VISOR DE RESÚMENES ---
const SummariesViewer = ({ summaries }) => {
  if (!summaries || summaries.length === 0) {
    return (
      <p className="text-slate-400 py-6">
        Este tema todavía no tiene resúmenes cargados por el docente.
      </p>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      {summaries.map((summary) => (
        <Card key={summary.id}>
          <CardHeader className="p-5">
            <CardTitle className="text-lg font-bold leading-snug">
              {summary.title}
            </CardTitle>
            {summary.date && (
              <p className="text-xs text-slate-500">
                {new Date(summary.date).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
            <CardDescription className="text-sm leading-relaxed whitespace-pre-wrap text-slate-300 mt-2">
              {summary.content}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---
const StudyCourse = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [mode, setMode] = useState('cards');

  const { data: subscriptions, isLoading: subsLoading } =
    useCourseSubscriptions();

  // Materias únicas de los cursos suscriptos
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

  // Cursos de la materia seleccionada
  const filteredCourses = useMemo(() => {
    if (!subscriptions || !selectedSubjectId) return [];
    return subscriptions
      .filter((sub) => sub.course?.subjectId === Number(selectedSubjectId))
      .map((sub) => sub.course);
  }, [subscriptions, selectedSubjectId]);

  // Temas de la materia del curso
  const { data: topics, isLoading: topicsLoading } = useTopics(
    selectedCourse?.subjectId,
    !!selectedCourse
  );

  // Tarjetas y resúmenes del docente
  const { data: cards, isLoading: cardsLoading } = useCards(selectedTopic?.id, {
    authorId: selectedCourse?.authorId,
  });
  const { data: summaries, isLoading: summariesLoading } = useSummaries(
    selectedTopic?.id,
    { authorId: selectedCourse?.authorId }
  );

  if (subsLoading) return <GetSkeleton />;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {selectedTopic ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedTopic(null)}
          className="cursor-pointer mb-2 text-slate-300 hover:text-white"
        >
          ← Volver a temas
        </Button>
      ) : selectedCourse ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedCourse(null)}
          className="cursor-pointer mb-2 text-slate-300 hover:text-white"
        >
          ← Volver a cursos
        </Button>
      ) : selectedSubjectId ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedSubjectId(null)}
          className="cursor-pointer mb-2 text-slate-300 hover:text-white"
        >
          ← Volver a materias
        </Button>
      ) : null}

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {selectedTopic
              ? selectedTopic.name
              : selectedCourse
                ? selectedCourse.subject?.name
                : selectedSubjectId
                  ? 'Elegí un Curso'
                  : 'Mis Cursos Suscriptos'}
          </h1>
        </div>
        <p className="text-slate-400 mt-1">
          {selectedTopic
            ? `Curso dictado por ${selectedCourse.author?.name || 'Docente'} ${selectedCourse.author?.lastName || ''}`
            : selectedCourse
              ? 'Seleccioná un tema para estudiar'
              : selectedSubjectId
                ? 'Cursos disponibles en esta materia a los que te suscribiste'
                : 'Elegí una materia para acceder a tus contenidos de estudio'}
        </p>
      </div>

      {!selectedSubjectId && (
        <>
          {subjects.length === 0 ? (
            <p className="text-slate-400">
              Todavía no estás inscripto en ningún curso.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub) => (
                <Card
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className="cursor-pointer hover:border-blue-500/80 transition-colors flex flex-col justify-between"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">
                      {sub.name}
                    </CardTitle>
                    {sub.description && (
                      <CardDescription className="text-slate-400 text-sm mt-1">
                        {sub.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {selectedSubjectId && !selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((c) => (
            <Card key={c.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  {c.subject?.name}
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm">
                  Docente: {c.author?.name} {c.author?.lastName}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  size="sm"
                  onClick={() => setSelectedCourse(c)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
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
            <p className="text-slate-400">
              Esta materia todavía no tiene temas creados.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics?.map((topic) => (
                <Card key={topic.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">
                      {topic.name}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTopic(topic);
                        setMode('cards');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                      Estudiar tema
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
          <div className="flex gap-2">
            <Button
              variant={mode === 'cards' ? 'default' : 'outline'}
              onClick={() => setMode('cards')}
              className={
                mode === 'cards'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'cursor-pointer text-slate-300'
              }
            >
              <Layers className="w-4 h-4 mr-2" /> Tarjetas
            </Button>
            <Button
              variant={mode === 'summaries' ? 'default' : 'outline'}
              onClick={() => setMode('summaries')}
              className={
                mode === 'summaries'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'cursor-pointer text-slate-300'
              }
            >
              <BookOpen className="w-4 h-4 mr-2" /> Resúmenes
            </Button>
          </div>

          {mode === 'cards' ? (
            cardsLoading ? (
              <GetSkeleton />
            ) : (
              <FlashcardPlayer cards={cards} />
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
