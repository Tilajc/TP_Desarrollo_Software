import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  ArrowRight,
  BrainCircuit,
  Library,
  FileText,
  CheckSquare,
  PlusCircle,
} from 'lucide-react';
import { useGetMe } from '../hooks/useAuth';
import { useCourses } from '../hooks/useCourses';
import { useSubjects } from '../hooks/useSubjects';
import { useUsers } from '../hooks/useUsers';
import { Button } from '../components/ui/button';
import useLoginStatus from '../store/useLoginStatus';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card';
import GetSkeleton from '../components/GetSkeleton';

// --- VISTA 1: INVITADO / LANDING PÚBLICA ---
const GuestHome = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-5xl mx-auto space-y-16">
      {/* Hero Section */}

      <div className="text-center space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/40 bg-blue-950/50 text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span>Study Buddies</span>
          <Sparkles className="w-3.5 h-3.5 text-blue-300 ml-0.5" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Aprendé, creá y compartí{' '}
          <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            cursos de estudio
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Creá tu cuenta, elegí tus materias y armá cursos con resúmenes clave y
          flashcards interactivas. Compartí o monetizá tu material para que
          otros estudiantes aprendan de tu experiencia y aprueben juntos.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/register">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 cursor-pointer shadow-lg shadow-blue-500/25 transition-transform hover:scale-105 active:scale-95"
            >
              Comenzar gratis <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-100 hover:text-white px-8 cursor-pointer transition-transform hover:scale-105"
            >
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </div>

      {/* Características */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Card className="border-slate-800/80 bg-slate-950/40 hover:border-blue-500/40 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <CardTitle className="text-lg text-white">
              Creá tus Cursos
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Seleccioná tu materia y organizá tu estudio creando resúmenes
              estructurados y conjuntos de flashcards autoevaluativas.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-slate-800/80 bg-slate-950/40 hover:border-indigo-500/40 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
            </div>
            <CardTitle className="text-lg text-white">
              Aprendé de Pares
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Inscribite y accedé a cursos creados por compañeros que ya
              cursaron y resumieron los temas clave de la cursada.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-slate-800/80 bg-slate-950/40 hover:border-emerald-500/40 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
            </div>
            <CardTitle className="text-lg text-white">
              Comunidad de Aprendizaje
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Compartí tu conocimiento con otros alumnos, conseguí suscriptores
              para tus guías de estudio y potenciá tu carrera.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

// --- VISTA 2: ADMINISTRADOR ---
const AdminHome = ({ user }) => {
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();
  const { data: courses, isLoading: loadingCourses } = useCourses();
  const { data: users, isLoading: loadingUsers } = useUsers();

  const totalSubjects = subjects?.length || 0;
  const totalCourses = courses?.length || 0;
  const totalUsers = users?.length || 0;

  const metrics = [
    {
      title: 'Usuarios totales',
      value: loadingUsers ? '...' : totalUsers,
      icon: <Users className="w-4 h-4 text-blue-400" />,
    },
    {
      title: 'Materias activas',
      value: loadingSubjects ? '...' : totalSubjects,
      icon: <Library className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: 'Cursos de alumnos',
      value: loadingCourses ? '...' : totalCourses,
      icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
    },
    {
      title: 'Banco de Flashcards',
      value: '340',
      icon: <Layers className="w-4 h-4 text-violet-400" />,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" /> Panel de Administración
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          ¡Hola, {user.name || 'Admin'}!
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Supervisá el contenido educativo, las materias y los usuarios de la
          plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card
            key={idx}
            className="bg-slate-900 border-slate-800 text-slate-50 shadow-sm"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>{metric.title}</span>
                {metric.icon}
              </div>
              <div className="text-3xl font-extrabold text-white mt-3">
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-900 border-slate-800 p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Acciones rápidas
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/subjects">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer shadow-lg shadow-blue-500/20"
            >
              + Nueva Materia
            </Button>
          </Link>
          <Link to="/cards">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-950/40 hover:bg-slate-800 text-slate-200"
            >
              Moderación de Tarjetas
            </Button>
          </Link>
          <Link to="/users">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-800 bg-slate-950/40 hover:bg-slate-800 text-slate-200"
            >
              Gestionar Usuarios
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Library className="w-5 h-5 text-blue-400" /> Estado del
                Catálogo
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-1">
                Materias dadas de alta y el volumen de sus ejes temáticos
              </CardDescription>
            </div>
            <Link
              to="/subjects"
              className="text-xs text-blue-400 hover:underline"
            >
              Ver todas →
            </Link>
          </CardHeader>

          <CardContent className="p-6 space-y-3">
            {loadingSubjects ? (
              <p className="text-xs text-slate-400">Cargando materias...</p>
            ) : totalSubjects === 0 ? (
              <p className="text-xs text-slate-400">
                No hay materias registradas aún.
              </p>
            ) : (
              subjects.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {sub.name}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {sub.description || 'Sin descripción cargada'}
                    </p>
                  </div>
                  <Link to={`/subjects`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 bg-slate-900 text-xs"
                    >
                      Gestionar
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-50 flex flex-col justify-between">
          <div>
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" /> Últimos
                Cursos de Alumnos
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-1">
                Suscripciones y cursos creados por los estudiantes
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-3">
              {loadingCourses ? (
                <p className="text-xs text-slate-400">Cargando cursos...</p>
              ) : totalCourses === 0 ? (
                <p className="text-xs text-slate-500">
                  Todavía ningún alumno creó cursos.
                </p>
              ) : (
                courses.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 border-b border-slate-800/60 last:border-0"
                  >
                    <div className="pr-2">
                      <p className="text-sm font-semibold text-slate-200 line-clamp-1">
                        {course.subject?.name || `Curso #${course.id}`}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Por: {course.author?.name || 'Estudiante'}
                      </p>
                    </div>
                    <Link to={`/courses`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Revisar
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </div>

          <div className="p-6 pt-0 border-t border-slate-800/40">
            <Link
              to="/courses"
              className="text-xs text-slate-400 hover:text-white flex items-center justify-between pt-4 font-medium"
            >
              <span>Ver todos los cursos creados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- VISTA 3: ALUMNO / ESTUDIANTE ---
const StudentHome = ({ user }) => {
  const { data: courses, isLoading: loadingCourses } = useCourses(
    { authorId: user?.id },
    !!user?.id
  );

  const totalCourses = courses?.length || 0;

  const metrics = [
    {
      title: 'Materias activas',
      value: loadingCourses ? '...' : totalCourses,
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
    },
    {
      title: 'Tarjetas estudiadas',
      value: '128',
      icon: <CheckSquare className="w-4 h-4 text-emerald-400" />,
    },
    {
      title: 'Cuestionarios rendidos',
      value: '8',
      icon: <FileText className="w-4 h-4 text-amber-400" />,
    },
    {
      title: 'Promedio general',
      value: '8.6/10',
      icon: <GraduationCap className="w-4 h-4 text-violet-400" />,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            ¡Hola, {user?.name || 'Estudiante'}!
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Seguí aprendiendo cada día y repasando tus materias al día.
          </p>
        </div>

        <Link to="/study">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 cursor-pointer shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 active:scale-95">
            <BrainCircuit className="w-4 h-4 mr-2" /> Entrar a Estudiar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card
            key={idx}
            className="bg-slate-900 border-slate-800 text-slate-50 shadow-sm"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>{metric.title}</span>
                {metric.icon}
              </div>
              <div className="text-3xl font-extrabold text-white mt-3">
                {metric.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" /> Mis Materias
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-1">
                Tus cursos y materiales organizados por materia
              </CardDescription>
            </div>
            <Link
              to="/my-courses"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>

          <CardContent className="p-6 space-y-3">
            {loadingCourses ? (
              <p className="text-xs text-slate-400">Cargando tus materias...</p>
            ) : totalCourses === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-300 font-medium">
                  Todavía no creaste ningún curso.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Elegí una materia para comenzar a subir tarjetas y resúmenes.
                </p>
                <Link to="/my-courses" className="inline-block mt-3">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    + Crear mi primer curso
                  </Button>
                </Link>
              </div>
            ) : (
              courses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-colors"
                >
                  <div className="pr-3">
                    <p className="text-sm font-semibold text-white">
                      {course.subject?.name || `Curso #${course.id}`}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {course.subject?.description ||
                        'Curso de estudio y preparación'}
                    </p>
                  </div>
                  <Link to={`/my-courses/${course.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 whitespace-nowrap"
                    >
                      Abrir Curso
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-50 flex flex-col justify-between">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" /> Cursos y Apuntes
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              Compartí tu material o explorá nuevos cursos
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/20 space-y-2">
              <p className="text-xs font-semibold text-blue-300">
                ¿Tenés resúmenes de tu cursada?
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Armá un curso con tus flashcards y apuntes para ayudar a otros
                estudiantes.
              </p>
              <Link to="/my-courses" className="inline-block pt-1 w-full">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs w-full"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Crear Curso
                </Button>
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <Link
                to="/subjects"
                className="text-xs text-slate-400 hover:text-white flex items-center justify-between font-medium"
              >
                <span>Explorar todas las materias</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- COMPONENTE ROUTER PRINCIPAL DE HOME ---
const Home = () => {
  const { isLoggedIn } = useLoginStatus();
  const token = localStorage.getItem('token');
  const { data: user, isLoading } = useGetMe();

  // Si no está logueado en Zustand o no existe token, va directo a GuestHome sin esperar a useGetMe
  if (!isLoggedIn || !token) {
    return <GuestHome />;
  }

  // Mientras valida el usuario en el backend
  if (isLoading) {
    return <GetSkeleton />;
  }

  // Si no se obtuvo el usuario
  if (!user) {
    return <GuestHome />;
  }

  // Vista condicional según rol
  const role = user.role?.toUpperCase();
  if (role === 'ADMIN') {
    return <AdminHome user={user} />;
  }

  return <StudentHome user={user} />;
};

export default Home;
