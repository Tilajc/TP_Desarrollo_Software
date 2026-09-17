import { useState } from 'react';

const Cards = () => {
  const [showAnswer, setShowAnswer] = useState(false);

  const flashcard = {
    pregunta: '¿Qué es una derivada?',
    respuesta:
      'La derivada de una función en un punto mide la tasa de cambio instantánea de la función en ese punto.',
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0f1422] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-white text-base font-medium text-center">
            Estudiando: Derivadas
          </h2>
        </div>

        <div className="text-center text-xs text-slate-500 mb-4 font-medium">
          Tarjeta 1 de 12
        </div>

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
                {flashcard.pregunta}
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
                {flashcard.respuesta}
              </p>
              <p className="text-xs text-slate-600 italic pt-6 group-hover:text-slate-500 transition-colors">
                Click para volver a la pregunta
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <button className="w-full py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/50 hover:border-rose-800 text-rose-300 rounded-xl text-xs font-medium transition-all shadow-sm cursor-pointer">
            No lo sabía
          </button>
          <button className="w-full py-2.5 px-3 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-900/40 hover:border-amber-800 text-amber-300 rounded-xl text-xs font-medium transition-all shadow-sm cursor-pointer">
            Dudé
          </button>
          <button className="w-full py-2.5 px-3 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-900/50 hover:border-emerald-800 text-emerald-300 rounded-xl text-xs font-medium transition-all shadow-sm cursor-pointer">
            Lo sabía
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
