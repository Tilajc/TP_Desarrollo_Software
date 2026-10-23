import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, X, Lightbulb } from 'lucide-react';
import { useTopic } from '../../hooks/useTopics';
import {
  useCards,
  useCreateCard,
  useUpdateCard,
  useDeleteCard,
} from '../../hooks/useCards';
import { useCreateHint, useHints } from '../../hooks/useHints';
import FormModal from '../../components/FormModal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import GetSkeleton from '@/components/GetSkeleton';

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

const TopicCards = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const { data: topic } = useTopic(topicId);
  const { data: cards, isLoading, isError } = useCards(topicId);
  const { data: hints } = useHints();
  const createMutation = useCreateCard();
  const updateMutation = useUpdateCard();
  const deleteMutation = useDeleteCard();
  const createHintMutation = useCreateHint();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleOpenCreate = () => {
    setSelectedCard(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card) => {
    const cardHint = hints?.find((h) => h.cardId === card.id);
    setSelectedCard({
      ...card,
      hint: cardHint ? cardHint.content : '',
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (card) => {
    setSelectedCard(card);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const { hint, ...cardData } = formData;

    if (selectedCard) {
      updateMutation.mutate(
        { id: selectedCard.id, data: cardData },
        {
          onSuccess: () => {
            if (hint && hint.trim()) {
              createHintMutation.mutate({
                content: hint.trim(),
                cardId: selectedCard.id,
              });
            }
            setIsModalOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(
        { ...cardData, topicId: Number(topicId) },
        {
          onSuccess: (newCard) => {
            const targetId = newCard?.id || newCard?.data?.id;
            if (hint && hint.trim() && targetId) {
              createHintMutation.mutate({
                content: hint.trim(),
                cardId: targetId,
              });
            }
            setIsModalOpen(false);
          },
        }
      );
    }
  };

  const handleDeleteSubmit = () => {
    if (!selectedCard) return;
    deleteMutation.mutate(selectedCard.id, {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  if (isError)
    return <p className="p-4 text-red-500">Error al cargar las tarjetas.</p>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/subjects/${subjectId}/topics`)}
        className="cursor-pointer mb-4"
      >
        ← Volver a Temas
      </Button>

      {/* Header Mobile-First: en celular el botón pasa abajo al 100% y en SM se ubica al costado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Tarjetas{topic ? ` de ${topic.name}` : ''}
        </h1>
        <Button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
        >
          + Crear Tarjeta
        </Button>
      </div>

      {isLoading ? (
        <GetSkeleton />
      ) : (
        <>
          {cards?.length === 0 && (
            <p className="text-slate-400">
              Este tema todavía no tiene tarjetas.
            </p>
          )}

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards?.map((card) => {
              const cardHint = hints?.find((h) => h.cardId === card.id);

              return (
                <Card
                  key={card.id}
                  className="flex flex-col justify-between relative h-[210px] sm:h-[220px]"
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

                  <CardHeader className="p-5 flex-1 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-1.5">
                      {/* Pregunta truncada a 2 líneas con tooltip nativo al pasar el cursor */}
                      <CardTitle
                        className="mr-16 text-base sm:text-lg font-bold leading-snug line-clamp-2 cursor-help"
                        title={card.question}
                      >
                        {card.question}
                      </CardTitle>

                      {/* Respuesta truncada a 2 líneas con tooltip nativo */}
                      <CardDescription
                        className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2 cursor-help"
                        title={card.answer}
                      >
                        {card.answer}
                      </CardDescription>
                    </div>

                    {/* Contenedor de la pista fijado en la parte inferior */}
                    {cardHint ? (
                      <div
                        className="mt-3 flex items-start gap-2 text-xs bg-sky-50 border border-sky-200 text-sky-900 px-3 py-2 rounded-lg cursor-help"
                        title={cardHint.content}
                      >
                        <Lightbulb className="w-3.5 h-3.5 shrink-0 text-sky-600 mt-0.5" />
                        <div className="leading-snug line-clamp-1">
                          <strong className="font-semibold text-sky-950 mr-1">
                            Pista:
                          </strong>
                          {cardHint.content}
                        </div>
                      </div>
                    ) : (
                      /* Espacio vacío para equilibrar las tarjetas sin pista */
                      <div className="mt-3 h-[34px]" />
                    )}
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <FormModal
            key={selectedCard ? `edit-${selectedCard.id}` : 'create-card'}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title={selectedCard ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
            fields={CARD_FIELDS}
            initialData={selectedCard}
            onSubmit={handleSubmit}
            isLoading={
              createMutation.isPending ||
              updateMutation.isPending ||
              createHintMutation.isPending
            }
          />

          <FormModal
            key={selectedCard ? `delete-${selectedCard.id}` : 'delete-card'}
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            title="¿Deseas eliminar esta tarjeta?"
            fields={[]}
            onSubmit={handleDeleteSubmit}
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  );
};

export default TopicCards;
