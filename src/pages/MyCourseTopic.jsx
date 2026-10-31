import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, X, Lightbulb } from 'lucide-react';
import { useGetMe } from '@/hooks/useAuth';
import { useCourse } from '@/hooks/useCourses';
import { useTopic } from '@/hooks/useTopics';
import {
  useCards,
  useCreateCard,
  useUpdateCard,
  useDeleteCard,
} from '@/hooks/useCards';
import { useCreateHint, useUpdateHint, useDeleteHint } from '@/hooks/useHints';
import {
  useSummaries,
  useCreateSummary,
  useUpdateSummary,
  useDeleteSummary,
} from '@/hooks/useSummaries';
import FormModal from '@/components/FormModal';
import { cardSchema } from '@/schemas/card';
import { summarySchema } from '@/schemas/summary';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';
import SearchInput from '@/components/SearchInput';
import useSearch from '@/hooks/useSearch';

const CARD_FIELDS = [
  {
    name: 'question',
    label: 'Pregunta',
    placeholder: 'Ej: ¿Qué es una derivada?',
    required: true,
    type: 'textarea',
  },
  {
    name: 'answer',
    label: 'Respuesta',
    placeholder: 'Escribí la respuesta de la tarjeta',
    required: true,
    type: 'textarea',
  },
  {
    name: 'hint',
    label: 'Pista (opcional)',
    placeholder: 'Ej: Pensar en la tasa de cambio instantánea',
    required: false,
    type: 'text',
  },
];

const SUMMARY_FIELDS = [
  {
    name: 'title',
    label: 'Título del resumen',
    placeholder: 'Ej: Regla de la Cadena y Derivación',
    required: true,
  },
  {
    name: 'content',
    label: 'Contenido / Explicación',
    placeholder: 'Escribí acá la explicación detallada...',
    type: 'textarea',
    required: true,
  },
];

const CardsSection = ({ topicId, meId }) => {
  const queryClient = useQueryClient();

  const {
    data: cards,
    isLoading,
    isError,
  } = useCards(topicId, { authorId: meId });
  const {
    query,
    setQuery,
    filtered: visibleCards,
    isSearching,
  } = useSearch(cards, (card) =>
    [
      card.question,
      card.answer,
      ...(card.hints?.map((hint) => hint.content) ?? []),
    ].join(' ')
  );
  const createMutation = useCreateCard();
  const updateMutation = useUpdateCard();
  const deleteMutation = useDeleteCard();
  const createHintMutation = useCreateHint();
  const updateHintMutation = useUpdateHint();
  const deleteHintMutation = useDeleteHint();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleOpenCreate = () => {
    setSelectedCard(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card) => {
    setSelectedCard({ ...card, hint: card.hints?.[0]?.content || '' });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (card) => {
    setSelectedCard(card);
    setIsDeleteModalOpen(true);
  };

  const handleModalOpenChange = (isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      createMutation.reset();
      updateMutation.reset();
      setSelectedCard(null);
    }
  };

  const saveHint = (cardId, currentHint, text) => {
    const content = text?.trim() || '';
    const refreshCards = {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
    };

    if (currentHint && !content) {
      deleteHintMutation.mutate(currentHint.id, refreshCards);
    } else if (currentHint && content !== currentHint.content) {
      updateHintMutation.mutate(
        { id: currentHint.id, data: { content } },
        refreshCards
      );
    } else if (!currentHint && content) {
      createHintMutation.mutate({ content, cardId }, refreshCards);
    }
  };

  const handleSubmit = (formData) => {
    const { hint, ...cardData } = formData;

    if (selectedCard) {
      updateMutation.mutate(
        { id: selectedCard.id, data: cardData },
        {
          onSuccess: () => {
            saveHint(selectedCard.id, selectedCard.hints?.[0], hint);
            setIsModalOpen(false);
            updateMutation.reset();
            setSelectedCard(null);
          },
        }
      );
    } else {
      createMutation.mutate(
        { ...cardData, topicId: Number(topicId) },
        {
          onSuccess: (newCard) => {
            saveHint(newCard.id, null, hint);
            setIsModalOpen(false);
            createMutation.reset();
          },
        }
      );
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedCard) return;
    deleteMutation.mutate(selectedCard.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        deleteMutation.reset();
        setSelectedCard(null);
      },
    });
  };

  if (isError)
    return <p className="text-red-500">Error al cargar tus tarjetas.</p>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Tarjeta
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          {cards?.length > 0 && (
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Buscar tarjetas..."
              noResults={isSearching && visibleCards.length === 0}
            />
          )}
          {cards?.length === 0 && (
            <p className="text-slate-400">
              Todavía no cargaste tarjetas en este tema.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCards?.map((card) => {
              const cardHint = card.hints?.[0];

              return (
                <Card
                  key={card.id}
                  className="flex flex-col justify-between relative h-auto min-h-47.5"
                >
                  <div className="absolute right-0 top-0 z-10 flex gap-2 p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(card)}
                      className="cursor-pointer"
                      aria-label="Editar tarjeta"
                      title="Editar tarjeta"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleOpenDelete(card)}
                      className="cursor-pointer"
                      aria-label="Eliminar tarjeta"
                      title="Eliminar tarjeta"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <CardHeader className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <CardTitle className="mr-20 text-lg font-bold leading-snug wrap-break-words">
                        {card.question}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed wrap-break-words whitespace-normal text-slate-600 dark:text-slate-300">
                        {card.answer}
                      </CardDescription>
                    </div>

                    {cardHint && (
                      <div className="mt-4 flex items-start gap-2 text-xs bg-sky-50 border border-sky-200 text-sky-900 px-3 py-2.5 rounded-lg">
                        <Lightbulb className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                        <div className="leading-relaxed wrap-break-words whitespace-normal">
                          <strong className="font-semibold text-sky-950 mr-1">
                            Pista:
                          </strong>
                          {cardHint.content}
                        </div>
                      </div>
                    )}
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <FormModal
            key={selectedCard ? `edit-${selectedCard.id}` : 'create-card'}
            open={isModalOpen}
            onOpenChange={handleModalOpenChange}
            title={selectedCard ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
            fields={CARD_FIELDS}
            initialData={selectedCard}
            schema={cardSchema}
            onSubmit={handleSubmit}
            error={createMutation.error || updateMutation.error}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={
              isDeleteModalOpen ? `delete-${selectedCard?.id}` : 'delete-closed'
            }
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => {
              setIsDeleteModalOpen(isOpen);
              if (!isOpen) {
                deleteMutation.reset();
                setSelectedCard(null);
              }
            }}
            title="¿Deseas eliminar esta tarjeta?"
            fields={[]}
            onSubmit={handleDeleteSubmit}
            error={deleteMutation.error}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </>
  );
};

const SummariesSection = ({ topicId, meId }) => {
  const {
    data: summaries,
    isLoading,
    isError,
  } = useSummaries(topicId, { authorId: meId });
  const {
    query,
    setQuery,
    filtered: visibleSummaries,
    isSearching,
  } = useSearch(summaries, (summary) =>
    [summary.title, summary.content].join(' ')
  );
  const createMutation = useCreateSummary();
  const updateMutation = useUpdateSummary();
  const deleteMutation = useDeleteSummary();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  const handleOpenCreate = () => {
    setSelectedSummary(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (summary) => {
    setSelectedSummary(summary);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (summary) => {
    setSelectedSummary(summary);
    setIsDeleteModalOpen(true);
  };

  const handleModalOpenChange = (isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      createMutation.reset();
      updateMutation.reset();
      setSelectedSummary(null);
    }
  };

  const handleSubmit = (formData) => {
    const payload = { ...formData, topicId: Number(topicId) };

    if (selectedSummary) {
      updateMutation.mutate(
        { id: selectedSummary.id, data: payload },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            updateMutation.reset();
            setSelectedSummary(null);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsModalOpen(false);
          createMutation.reset();
        },
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedSummary) return;
    deleteMutation.mutate(selectedSummary.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        deleteMutation.reset();
        setSelectedSummary(null);
      },
    });
  };

  if (isError)
    return <p className="text-red-500">Error al cargar tus resúmenes.</p>;

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleOpenCreate}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Resumen
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          {summaries?.length > 0 && (
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Buscar resúmenes..."
              noResults={isSearching && visibleSummaries.length === 0}
            />
          )}
          {summaries?.length === 0 && (
            <p className="text-slate-400">
              Todavía no cargaste resúmenes en este tema.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleSummaries?.map((summary) => (
              <Card
                key={summary.id}
                className="flex flex-col justify-between relative h-auto min-h-47.5"
              >
                <div className="absolute right-0 top-0 z-10 flex gap-2 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(summary)}
                    className="cursor-pointer"
                    aria-label="Editar resumen"
                    title="Editar resumen"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(summary)}
                    className="cursor-pointer"
                    aria-label="Eliminar resumen"
                    title="Eliminar resumen"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <CardHeader className="p-5">
                  <CardTitle className="mr-20 text-lg font-bold leading-snug wrap-break-words">
                    {summary.title}
                  </CardTitle>
                  {summary.date && (
                    <p className="text-xs text-slate-500">
                      {new Date(summary.date).toLocaleDateString('es-AR')}
                    </p>
                  )}
                  <CardDescription className="text-sm leading-relaxed wrap-break-words whitespace-pre-wrap text-slate-600 dark:text-slate-300">
                    {summary.content}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <FormModal
            key={
              selectedSummary ? `edit-${selectedSummary.id}` : 'create-summary'
            }
            open={isModalOpen}
            onOpenChange={handleModalOpenChange}
            title={selectedSummary ? 'Editar Resumen' : 'Nuevo Resumen'}
            fields={SUMMARY_FIELDS}
            initialData={selectedSummary}
            schema={summarySchema}
            onSubmit={handleSubmit}
            error={createMutation.error || updateMutation.error}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <FormModal
            key={
              isDeleteModalOpen
                ? `delete-${selectedSummary?.id}`
                : 'delete-closed'
            }
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => {
              setIsDeleteModalOpen(isOpen);
              if (!isOpen) {
                deleteMutation.reset();
                setSelectedSummary(null);
              }
            }}
            title="¿Deseas eliminar este resumen?"
            fields={[]}
            onSubmit={handleDeleteSubmit}
            error={deleteMutation.error}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </>
  );
};

const MyCourseTopic = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState('cards');

  const { data: me } = useGetMe();
  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
  } = useCourse(courseId);
  const {
    data: topic,
    isLoading: topicLoading,
    isError: topicError,
  } = useTopic(topicId);

  if (courseError || topicError)
    return <p className="p-4 text-red-500">No se encontró el tema.</p>;

  if (courseLoading || topicLoading || !me) return <GetSkeleton />;

  if (course.authorId !== me.id)
    return <p className="p-4 text-red-500">No tenés acceso a este curso.</p>;

  if (topic.subjectId !== course.subjectId)
    return (
      <p className="p-4 text-red-500">
        Este tema no pertenece a la materia de tu curso.
      </p>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/my-courses/${courseId}`)}
        className="cursor-pointer mb-4"
      >
        ← Volver al curso
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{topic.name}</h1>
        <p className="text-slate-400 mt-1">{course.subject?.name}</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={tab === 'cards' ? 'default' : 'outline'}
          onClick={() => setTab('cards')}
          className={
            tab === 'cards'
              ? 'cursor-pointer bg-blue-500 hover:bg-blue-600 text-white'
              : 'cursor-pointer'
          }
        >
          Tarjetas
        </Button>
        <Button
          variant={tab === 'summaries' ? 'default' : 'outline'}
          onClick={() => setTab('summaries')}
          className={
            tab === 'summaries'
              ? 'cursor-pointer bg-blue-500 hover:bg-blue-600 text-white'
              : 'cursor-pointer'
          }
        >
          Resúmenes
        </Button>
      </div>

      {tab === 'cards' ? (
        <CardsSection topicId={topicId} meId={me.id} />
      ) : (
        <SummariesSection topicId={topicId} meId={me.id} />
      )}
    </div>
  );
};

export default MyCourseTopic;
