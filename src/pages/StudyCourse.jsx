import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  Eye,
  ChevronRight,
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

// Subcomponente: Reproductor y respuesta interactiva de tarjetas
const FlashcardPlayer = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState({ correct: 0, review: 0 });
  const [finished, setFinished] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border rounded-xl text-slate-500">
        No hay tarjetas disponibles en este tema todavía.
      </div>
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
      <div className="p-8 max-w-md mx-auto text-center border rounded-2xl shadow-sm bg-white">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">¡Repaso terminado!</h3>
        <p className="text-slate-600 mb-6">
          Completaste las {cards.length} tarjetas de este tema.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
            <span className="text-2xl font-bold text-emerald-600">
              {score.correct}
            </span>
            <p className="text-xs text-emerald-800">Aprendidas</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <span className="text-2xl font-bold text-amber-600">
              {score.review}
            </span>
            <p className="text-xs text-amber-800">Para repasar</p>
          </div>
        </div>
        <Button
          onClick={handleRestart}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Volver a practicar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex justify-between items-center text-sm text-slate-500">
        <span>
          Tarjeta {currentIndex + 1} de {cards.length}
        </span>
        <span>
          Aciertos: {score.correct} | Repasar: {score.review}
        </span>
      </div>

      <Card className="min-h-[300px] flex flex-col justify-between shadow-md">
        <CardHeader>
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Pregunta
          </span>
          <CardTitle className="text-xl mt-1 leading-snug">
            {currentCard.question}
          </CardTitle>

          {hint && (
            <div className="mt-3">
              {showHint ? (
                <div className="flex items-start gap-2 text-xs bg-sky-50 border border-sky-200 text-sky-900 px-3 py-2 rounded-lg">
                  <Lightbulb className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                  <div>
                    <strong>Pista:</strong> {hint}
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(true)}
                  className="text-xs text-sky-600 hover:text-sky-700 h-7 px-2"
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
              <label className="text-xs font-medium text-slate-600 mb-1 block">
                Tu respuesta (opcional):
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Escribí lo que recuerdes antes de comprobar..."
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-20"
              />
            </div>
          )}

          {showAnswer && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
              <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase">
                Respuesta correcta
              </span>
              <p className="text-slate-800 text-base leading-relaxed">
                {currentCard.answer}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 border-t flex gap-2 justify-between">
          {!showAnswer ? (
            <Button
              onClick={() => setShowAnswer(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Eye className="w-4 h-4 mr-2" /> Mostrar Respuesta
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleNext(false)}
                className="w-1/2 border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Necesito repasar
              </Button>
              <Button
                onClick={() => handleNext(true)}
                className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-white"
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

// Subcomponente: Visor de resúmenes
const SummariesViewer = ({ summaries }) => {
  if (!summaries || summaries.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border rounded-xl text-slate-500">
        No hay resúmenes publicados para este tema todavía.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {summaries.map((summary) => (
        <Card key={summary.id} className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">
              {summary.title}
            </CardTitle>
            {summary.date && (
              <p className="text-xs text-slate-400">
                Publicado el{' '}
                {new Date(summary.date).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
              {summary.content}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Componente principal del Caso de Uso (CUU3)
const StudyCourse = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [mode, setMode] = useState(null); // 'cards' | 'summaries'

  const { data: subscriptions, isLoading: subsLoading } =
    useCourseSubscriptions();

  // Materias de los cursos en los que el alumno está inscripto
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

  // Cursos suscriptos de la materia elegida
  const filteredCourses = useMemo(() => {
    if (!subscriptions || !selectedSubjectId) return [];
    return subscriptions
      .filter((sub) => sub.course?.subjectId === Number(selectedSubjectId))
      .map((sub) => sub.course);
  }, [subscriptions, selectedSubjectId]);

  // Temas de la materia del curso elegido
  const { data: topics, isLoading: topicsLoading } = useTopics(
    selectedCourse?.subjectId,
    !!selectedCourse
  );

  // Tarjetas y resúmenes hechos por el creador del curso
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
      <div>
        <h1 className="text-3xl font-bold">Aprender y Practicar</h1>
        <p className="text-slate-500 mt-1">
          Accedé a los resúmenes y respondé tarjetas de tus cursos suscriptos.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border">
        <button
          onClick={() => {
            setSelectedSubjectId(null);
            setSelectedCourse(null);
            setSelectedTopic(null);
            setMode(null);
          }}
          className={`hover:underline ${!selectedSubjectId ? 'font-bold text-blue-600' : ''}`}
        >
          1. Materias
        </button>
        {selectedSubjectId && (
          <>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => {
                setSelectedCourse(null);
                setSelectedTopic(null);
                setMode(null);
              }}
              className={`hover:underline ${!selectedCourse ? 'font-bold text-blue-600' : ''}`}
            >
              2. Cursos
            </button>
          </>
        )}
        {selectedCourse && (
          <>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => {
                setSelectedTopic(null);
                setMode(null);
              }}
              className={`hover:underline ${!selectedTopic ? 'font-bold text-blue-600' : ''}`}
            >
              3. Temas
            </button>
          </>
        )}
        {selectedTopic && (
          <>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-blue-600">
              4. {mode === 'cards' ? 'Tarjetas' : 'Resúmenes'}
            </span>
          </>
        )}
      </div>

      {!selectedSubjectId && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Paso 1: Seleccioná la materia
          </h2>
          {subjects.length === 0 ? (
            <p className="text-slate-500">
              Todavía no estás inscripto en ningún curso.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub) => (
                <Card
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <CardHeader>
                    <CardTitle>{sub.name}</CardTitle>
                    {sub.description && (
                      <CardDescription>{sub.description}</CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedSubjectId && !selectedCourse && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Paso 2: Elegí el curso suscripto
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSubjectId(null)}
            >
              ← Cambiar materia
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((c) => (
              <Card
                key={c.id}
                onClick={() => setSelectedCourse(c)}
                className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              >
                <CardHeader>
                  <CardTitle>{c.subject?.name || `Curso #${c.id}`}</CardTitle>
                  <CardDescription>
                    Profesor: {c.author?.name} {c.author?.lastName}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    size="sm"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Ver Contenido
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedCourse && !selectedTopic && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Paso 3: Elegí el tema que querés estudiar
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCourse(null)}
            >
              ← Cambiar curso
            </Button>
          </div>
          {topicsLoading ? (
            <GetSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics?.map((topic) => (
                <Card
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setMode('cards');
                  }}
                  className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <CardHeader>
                    <CardTitle>{topic.name}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button size="sm" variant="outline" className="w-full">
                      Estudiar tema
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTopic && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4 border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">{selectedTopic.name}</h2>
              <p className="text-sm text-slate-500">
                Curso de {selectedCourse.subject?.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={mode === 'cards' ? 'default' : 'outline'}
                onClick={() => setMode('cards')}
                className={
                  mode === 'cards'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : ''
                }
              >
                <Layers className="w-4 h-4 mr-2" /> Responder Tarjetas
              </Button>
              <Button
                variant={mode === 'summaries' ? 'default' : 'outline'}
                onClick={() => setMode('summaries')}
                className={
                  mode === 'summaries'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : ''
                }
              >
                <BookOpen className="w-4 h-4 mr-2" /> Ver Resúmenes
              </Button>
            </div>
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
