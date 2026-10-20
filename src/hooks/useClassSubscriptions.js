import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiFetch from '../lib/api';

// Obtener todas las suscripciones a clases
export const useClassSubscriptions = () => {
  return useQuery({
    queryKey: ['classSubscriptions'],
    queryFn: () => apiFetch('/class-subscriptions'),
  });
};

// Crear nueva inscripción
export const useCreateClassSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSubscription) =>
      apiFetch('/class-subscriptions', {
        method: 'POST',
        body: JSON.stringify(newSubscription),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSubscriptions'] });
    },
  });
};

// Editar suscripción (ej: cambiar status a APROBADO, REGULAR, CURSANDO)
export const useUpdateClassSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      apiFetch(`/class-subscriptions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSubscriptions'] });
    },
  });
};

// Eliminar suscripción
export const useDeleteClassSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      apiFetch(`/class-subscriptions/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classSubscriptions'] });
    },
  });
};
