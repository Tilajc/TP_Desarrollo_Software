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
import { cardSchema } from '../../schemas/card';
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

  const handleModalOpenChange = (isOpen) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      createMutation.reset();
      updateMutation.reset();
      setSelectedCard(null);
    }
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
            const targetId = newCard?.id || newCard?.data?.id;
            if (hint && hint.trim() && targetId) {
              createHintMutation.mutate({
                content: hint.trim(),
                cardId: targetId,
              });
            }
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
    return <p className="p-4 text-red-500">Error al cargar las tarjetas.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/subjects/${subjectId}/topics`)}
        className="cursor-pointer mb-4"
      >
        ← Volver a Temas
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Tarjetas{topic ? ` de ${topic.name}` : ''}
        </h1>
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
          {cards?.length === 0 && (
            <p className="text-slate-400">
              Este tema todavía no tiene tarjetas.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards?.map((card) => {
              const cardHint = hints?.find((h) => h.cardId === card.id);

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

                      {/* Sin line-clamp: el texto se acomoda y expande la tarjeta hacia abajo */}
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
            isLoading={
              createMutation.isPending ||
              updateMutation.isPending ||
              createHintMutation.isPending
            }
          />

          <FormModal
            key={
              isDeleteModalOpen ? `delete-${selectedCard?.id}` : 'delete-closed'
            }
            open={isDeleteModalOpen}
            onOpenChange={(isOpen) => {
              setIsDeleteModalOpen(isOpen);
              if (!isOpen) setSelectedCard(null);
            }}
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
