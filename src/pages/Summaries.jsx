import { useState } from 'react';
import { Button } from '../components/ui/button.jsx';

const Summary = () => {
  const [isCleaned, setIsCleaned] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#0b0f19] text-slate-200 flex flex-col p-4 md:items-center md:justify-center">
      <div className="w-full md:max-w-2xl bg-[#0f1422] border border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl flex flex-col flex-1 md:flex-none">
        <h1 className="text-xl font-semibold text-white mb-5">Nuevo resumen</h1>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Título del resumen
            </label>
            <input
              type="text"
              defaultValue="Derivadas - Resumen personal"
              className="w-full bg-[#0b0f19]/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Apunte de referencia
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <select className="w-full bg-[#0b0f19]/60 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-200 appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer">
                  <option value="">Buscar en mis apuntes subidos...</option>
                  <option value="derivadas">Derivadas.pdf</option>
                  <option value="integrales">Integrales_Final.pdf</option>
                  <option value="algebra">Apunte_Algebra_UTN.pdf</option>
                </select>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <label className="flex items-center justify-center gap-2 bg-[#161b2c] hover:bg-[#1e253f] border border-slate-800 text-slate-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Subir archivo
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#0b0f19]/40 flex flex-col flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-[#0b0f19]/80 border-b border-slate-800 px-3 py-2 text-slate-400 text-xs">
              <span className="font-bold cursor-pointer hover:text-slate-200">
                B
              </span>
              <span className="italic cursor-pointer hover:text-slate-200">
                I
              </span>
              <span className="underline cursor-pointer hover:text-slate-200">
                U
              </span>
              <div className="h-4 w-px bg-slate-800" />
              <span className="cursor-pointer hover:text-slate-200">☰</span>
              <span className="cursor-pointer hover:text-slate-200">☷</span>
              <span className="cursor-pointer hover:text-slate-200">🔗</span>
              <div
                className="ml-auto cursor-pointer hover:text-rose-400 text-sm"
                onClick={(e) => {
                  const editor = e.currentTarget
                    .closest('.border')
                    .querySelector('[contenteditable]');
                  if (editor) {
                    editor.innerHTML = '';
                    setIsCleaned(true);
                  }
                }}
              >
                ✕
              </div>
            </div>

            <div
              className="p-4 text-sm text-slate-300 focus:outline-none min-h-62.5 md:min-h-75 flex-1 relative empty:before:content-[attr(placeholder)] empty:before:text-slate-600 empty:before:pointer-events-none select-text"
              contentEditable
              suppressContentEditableWarning
              placeholder="Escribí tu resumen acá..."
              onFocus={(e) => {
                if (!isCleaned) {
                  e.currentTarget.innerHTML = '';
                  setIsCleaned(true);
                }
              }}
            >
              <h2 className="text-base font-bold text-white">
                ¿Qué es una derivada?
              </h2>
              <p className="text-slate-400 leading-relaxed">
                La derivada de una función en un punto mide la tasa de cambio
                instantánea de la función en ese punto.
              </p>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">
                  Reglas básicas
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                  <li>Regla de la potencia</li>
                  <li>Regla del producto</li>
                  <li>Regla del cociente</li>
                  <li>Regla de la cadena</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 mt-6 pt-2">
          <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 bg-[#161b2c] hover:bg-[#1e253f] border border-slate-800 rounded-lg transition-colors">
            Cancelar
          </button>
          <Button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/10 transition-colors">
            Guardar resumen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
