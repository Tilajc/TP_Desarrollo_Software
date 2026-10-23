import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#0b0f19] px-4 text-center select-none">
      {/* Círculo con el ícono de advertencia */}
      <div className="flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-slate-900 border border-slate-800 text-amber-400 shadow-xl">
        <AlertTriangle className="w-10 h-10" />
      </div>

      {/* Número 404 */}
      <h1 className="text-8xl font-black text-slate-100 tracking-tight mb-2 drop-shadow-sm">
        404
      </h1>

      {/* Título */}
      <h2 className="text-2xl font-bold text-slate-200 mb-3">
        Página no encontrada
      </h2>

      {/* Subtítulo descriptivo */}
      <p className="text-slate-400 max-w-md mb-8 text-sm md:text-base leading-relaxed">
        La ruta a la que intentás acceder no existe o fue movida. Podés volver a
        la pantalla principal con el botón de abajo.
      </p>

      {/* Botón Volver al Inicio */}
      <Button
        asChild
        size="lg"
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
      >
        <Link to="/" className="inline-flex items-center gap-2">
          <Home className="w-5 h-5" />
          Volver al Inicio
        </Link>
      </Button>
    </div>
  );
}
