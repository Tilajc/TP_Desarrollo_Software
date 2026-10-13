import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, X } from 'lucide-react';
import { useTopic } from '../../hooks/useTopics';
import {
  useCards,
  useCreateCard,
  useUpdateCard,
  useDeleteCard,
} from '../../hooks/useCards';
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
];

const TopicCards = () => {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const { data: topic } = useTopic(topicId);
  const { data: cards, isLoading, isError } = useCards(topicId);
  const createMutation = useCreateCard();
  const updateMutation = useUpdateCard();
  const deleteMutation = useDeleteCard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleOpenCreate = () => {
    setSelectedCard(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (card) => {
    setSelectedCard(card);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (selectedCard) {
      updateMutation.mutate(
        { id: selectedCard.id, data: formData },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(
        { ...formData, topicId: Number(topicId) },
        { onSuccess: () => setIsModalOpen(false) }
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
    <div className="p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/materias/${subjectId}/temas`)}
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
            {cards?.map((card) => (
              <Card
                key={card.id}
                className="flex flex-col justify-between relative"
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
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleOpenDelete(card)}
                    className="cursor-pointer"
                    aria-label="Eliminar tarjeta"
                    title="Eliminar tarjeta"
                  >
                    <X />
                  </Button>
                </div>

                <CardHeader>
                  <CardTitle className="mr-20">{card.question}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {card.answer}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <FormModal
            key={selectedCard ? `edit-${selectedCard.id}` : 'create-card'}
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title={selectedCard ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
            fields={CARD_FIELDS}
            initialData={selectedCard}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
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
