import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useCards } from '../hooks/useCards';
import { useHints } from '../hooks/useHints';
import { useTopic } from '../hooks/useTopics';
import GetSkeleton from '@/components/GetSkeleton';
import { Button } from '@/components/ui/button';

const Cards = () => {
  const { topicId: routeTopicId } = useParams();
  const navigate = useNavigate();

  // Si no viene topicId en la URL, toma por defecto el ID 2
  const activeTopicId = routeTopicId || 2;

  const { data: topic } = useTopic(activeTopicId);
  const {
    data: cards,
    isLoading: cardsLoading,
    isError,
  } = useCards(activeTopicId);
  const { data: hints } = useHints();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Tarjeta actual
  const currentCard = cards && cards.length > 0 ? cards[currentIndex] : null;

  // Buscar si la tarjeta actual tiene pista asociada en la BD
  const currentHint = currentCard
    ? hints?.find((h) => h.cardId === currentCard.id)?.content
    : null;

  const handleNext = () => {
    setShowAnswer(false);
    setShowHint(false);

    if (cards && currentIndex + 1 < cards.length) {
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

  if (cardsLoading) {
    return (
      <div className="w-full min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <GetSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 text-center">
        <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 text-rose-400">
          <p>Hubo un error al cargar las tarjetas de estudio.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/materias')}
          >
            Volver a Materias
          </Button>
        </div>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="w-full min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[#0f1422] border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <h2 className="text-white text-lg font-medium">
            No hay tarjetas disponibles
          </h2>
          <p className="text-sm text-slate-400">
            Este tema todavía no cuenta con tarjetas creadas para estudiar.
          </p>
          <Button
            onClick={() => navigate('/materias')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Explorar otras materias
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        {/* Cabecera */}
        <div className="border-b border-slate-800 pb-4 mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver
          </Button>
          <h2 className="text-white text-sm font-medium">
            {topic ? topic.name : 'Estudiando'}
          </h2>
          <div className="w-16" />
        </div>

        {!isFinished ? (
          <>
            {/* Contador */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-medium px-1">
              <span>
                Tarjeta {currentIndex + 1} de {cards.length}
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

            {/* Flashcard interactiva */}
            <div
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full min-h-55 bg-[#0b0f19]/80 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/40 transition-all select-none group shadow-inner"
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

            {/* Pista Dinámica */}
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

            {/* Botones de Autoevaluación */}
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
          </>
        ) : (
          /* Vista de sesión finalizada */
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              ✓
            </div>
            <h3 className="text-lg font-semibold text-white">
              ¡Completaste todas las tarjetas!
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Repasaste las {cards.length} tarjetas de esta sesión de estudio.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Repasar de nuevo
              </Button>
              <Button
                onClick={() => navigate('/materias')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Ir a Materias
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;
