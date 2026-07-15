import { BookOpen, FileText, CheckSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Dashboard from '@/components/dashboard';

const Student = () => {
  return (
    <Dashboard
      userName="Juan"
      subtitle="Seguí aprendiendo cada día."
      sidebarItems={[
        { label: 'Inicio', icon: <BookOpen className="h-4 w-4" /> },
        { label: 'Mis materias', icon: <BookOpen className="h-4 w-4" /> },
        { label: 'Apuntes', icon: <FileText className="h-4 w-4" /> },
        { label: 'Cuestionarios', icon: <CheckSquare className="h-4 w-4" /> },
      ]}
      metrics={[
        { title: 'Materias activas', value: '5' },
        { title: 'Tarjetas estudiadas', value: '128' },
        { title: 'Cuestionarios rendidos', value: '8' },
        { title: 'Promedio general', value: '8.6/10' },
      ]}
    >
      {/* Componentes propios del alumno (Usa Cards de shadcn dentro) */}
      <Card className="col-span-1 lg:col-span-2 bg-slate-900 border-slate-800 text-slate-50">
        <CardContent className="p-6">Mis Materias...</CardContent>
      </Card>
      <Card className="bg-slate-900 border-slate-800 text-slate-50">
        <CardContent className="p-6">Últimos apuntes...</CardContent>
      </Card>
    </Dashboard>
  );
};

export default Student;
