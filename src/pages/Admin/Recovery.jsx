import { useState } from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { useDeletedSubjects, useRestoreSubject } from '@/hooks/useSubjects';
import { useDeletedTopics, useRestoreTopic } from '@/hooks/useTopics';
import FormModal from '@/components/FormModal';
import SearchInput from '@/components/SearchInput';
import useSearch from '@/hooks/useSearch';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

const formatDate = (value) =>
  value ? new Date(value).toLocaleString('es-AR') : 'fecha desconocida';

// ───────────────────────── Materias eliminadas ─────────────────────────
const DeletedSubjects = () => {
  const { data: subjects, isLoading, isError } = useDeletedSubjects();
  const {
    query,
    setQuery,
    filtered: visibleSubjects,
    isSearching,
  } = useSearch(subjects, (subject) =>
    [subject.name, subject.description].join(' ')
  );
  const restoreMutation = useRestoreSubject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleOpenRestore = (subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleRestoreSubmit = () => {
    if (!selectedSubject) return;
    restoreMutation.mutate(selectedSubject.id, {
      onSuccess: () => {
        setIsModalOpen(false);
        restoreMutation.reset();
        setSelectedSubject(null);
      },
    });
  };

  if (isError)
    return (
      <p className="text-red-500">Error al cargar las materias eliminadas.</p>
    );
  if (isLoading) return <GetSkeleton />;

  return (
    <>
      {subjects?.length > 0 && (
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar materias eliminadas..."
          noResults={isSearching && visibleSubjects.length === 0}
        />
      )}

      {subjects?.length === 0 && (
        <p className="text-slate-400">No hay materias eliminadas.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleSubjects?.map((subject) => (
          <Card key={subject.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{subject.name}</CardTitle>
              <CardDescription>
                <span className="block text-xs">
                  Eliminada el {formatDate(subject.deletedAt)}
                </span>
                {subject.description && (
                  <span className="block mt-1">{subject.description}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                size="sm"
                onClick={() => handleOpenRestore(subject)}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
              >
                <RotateCcw />
                Restaurar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <FormModal
        key={
          isModalOpen
            ? `restore-subject-${selectedSubject?.id}`
            : 'restore-closed'
        }
        open={isModalOpen}
        onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) {
            restoreMutation.reset();
            setSelectedSubject(null);
          }
        }}
        title={`¿Deseas restaurar la materia "${selectedSubject?.name}"? Vuelve junto con lo que se eliminó con ella: temas, cursos, tarjetas, resúmenes y pistas.`}
        fields={[]}
        onSubmit={handleRestoreSubmit}
        error={restoreMutation.error}
        isLoading={restoreMutation.isPending}
      />
    </>
  );
};

// ───────────────────────── Temas eliminados ─────────────────────────
// Solo aparecen los temas eliminados por su cuenta: los que se eliminaron junto
// con su materia vuelven al restaurar la materia.
const DeletedTopics = () => {
  const { data: topics, isLoading, isError } = useDeletedTopics();
  const {
    query,
    setQuery,
    filtered: visibleTopics,
    isSearching,
  } = useSearch(topics, (topic) => [topic.name, topic.subject?.name].join(' '));
  const restoreMutation = useRestoreTopic();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleOpenRestore = (topic) => {
    setSelectedTopic(topic);
    setIsModalOpen(true);
  };

  const handleRestoreSubmit = () => {
    if (!selectedTopic) return;
    restoreMutation.mutate(selectedTopic.id, {
      onSuccess: () => {
        setIsModalOpen(false);
        restoreMutation.reset();
        setSelectedTopic(null);
      },
    });
  };

  if (isError)
    return (
      <p className="text-red-500">Error al cargar los temas eliminados.</p>
    );
  if (isLoading) return <GetSkeleton />;

  return (
    <>
      {topics?.length > 0 && (
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar temas eliminados..."
          noResults={isSearching && visibleTopics.length === 0}
        />
      )}

      {topics?.length === 0 && (
        <p className="text-slate-400">
          No hay temas eliminados. Los temas que se eliminaron junto con su
          materia vuelven al restaurar la materia.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleTopics?.map((topic) => (
          <Card key={topic.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{topic.name}</CardTitle>
              <CardDescription>
                <span className="block">Materia: {topic.subject?.name}</span>
                <span className="block text-xs">
                  Eliminado el {formatDate(topic.deletedAt)}
                </span>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                size="sm"
                onClick={() => handleOpenRestore(topic)}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
              >
                <RotateCcw />
                Restaurar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <FormModal
        key={
          isModalOpen ? `restore-topic-${selectedTopic?.id}` : 'restore-closed'
        }
        open={isModalOpen}
        onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) {
            restoreMutation.reset();
            setSelectedTopic(null);
          }
        }}
        title={`¿Deseas restaurar el tema "${selectedTopic?.name}"? Vuelve junto con lo que se eliminó con él: tarjetas, resúmenes y pistas.`}
        fields={[]}
        onSubmit={handleRestoreSubmit}
        error={restoreMutation.error}
        isLoading={restoreMutation.isPending}
      />
    </>
  );
};

// ───────────────────────── Página ─────────────────────────
const Recovery = () => {
  const [tab, setTab] = useState('subjects');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trash2 className="w-8 h-8 text-indigo-400" />
          Recuperación de Materias y Temas Eliminados
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Materias y temas eliminados. Al restaurar vuelve también lo que se
          eliminó junto con ellos.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={tab === 'subjects' ? 'default' : 'outline'}
          onClick={() => setTab('subjects')}
          className={
            tab === 'subjects'
              ? 'cursor-pointer bg-blue-500 hover:bg-blue-600 text-white'
              : 'cursor-pointer text-black'
          }
        >
          Materias
        </Button>
        <Button
          variant={tab === 'topics' ? 'default' : 'outline'}
          onClick={() => setTab('topics')}
          className={
            tab === 'topics'
              ? 'cursor-pointer bg-blue-500 hover:bg-blue-600 text-white'
              : 'cursor-pointer text-black'
          }
        >
          Temas
        </Button>
      </div>

      {tab === 'subjects' ? <DeletedSubjects /> : <DeletedTopics />}
    </div>
  );
};

export default Recovery;
