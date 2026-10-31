import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  noResults = false,
}) => (
  <div className="mb-4">
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>

    {noResults && (
      <p className="text-slate-400 mt-3">
        No se encontraron resultados para “{value}”.
      </p>
    )}
  </div>
);

export default SearchInput;
