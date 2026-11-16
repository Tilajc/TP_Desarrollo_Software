import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Subjects from '@/pages/admin/subjects';
import { renderWithProviders } from '../../test-utils';

const mocks = vi.hoisted(() => ({
  subjectsQuery: {
    data: [],
    isLoading: false,
    isError: false,
  },
  userQuery: {
    data: { id: 1, role: 'ADMIN' },
  },
  createMutate: vi.fn(),
  updateMutate: vi.fn(),
  deleteMutate: vi.fn(),
  reset: vi.fn(),
}));

vi.mock('@/hooks/useSubjects', () => ({
  useSubjects: () => mocks.subjectsQuery,
  useCreateSubject: () => ({
    mutate: mocks.createMutate,
    isPending: false,
    error: null,
    reset: mocks.reset,
  }),
  useUpdateSubject: () => ({
    mutate: mocks.updateMutate,
    isPending: false,
    error: null,
    reset: mocks.reset,
  }),
  useDeleteSubject: () => ({
    mutate: mocks.deleteMutate,
    isPending: false,
    error: null,
    reset: mocks.reset,
  }),
}));

vi.mock('@/hooks/useAuth', () => ({
  useGetMe: () => mocks.userQuery,
}));

const sampleSubjects = [
  { id: 1, name: 'Análisis Matemático I', description: 'Cálculo diferencial' },
  { id: 2, name: 'Algoritmos y Estructuras', description: 'Listas y árboles' },
];

const setup = () => {
  const user = userEvent.setup();
  renderWithProviders(<Subjects />, { route: '/subjects' });
  return { user };
};

describe('Subjects Page', () => {
  beforeEach(() => {
    mocks.subjectsQuery = {
      data: sampleSubjects,
      isLoading: false,
      isError: false,
    };
    mocks.userQuery = {
      data: { id: 1, role: 'ADMIN' },
    };
    mocks.createMutate.mockReset();
    mocks.updateMutate.mockReset();
    mocks.deleteMutate.mockReset();
    mocks.reset.mockReset();
  });

  it('renderiza el título y la lista de materias', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Materias' })
    ).toBeInTheDocument();
    expect(screen.getByText('Análisis Matemático I')).toBeInTheDocument();
    expect(screen.getByText('Cálculo diferencial')).toBeInTheDocument();
    expect(screen.getByText('Algoritmos y Estructuras')).toBeInTheDocument();
  });

  it('muestra un mensaje de error cuando falla la carga de materias', () => {
    mocks.subjectsQuery = {
      data: undefined,
      isLoading: false,
      isError: true,
    };

    setup();

    expect(
      screen.getByText('Error al cargar las materias.')
    ).toBeInTheDocument();
  });

  it('filtra las materias al escribir en el buscador', async () => {
    const { user } = setup();

    const searchInput = screen.getByPlaceholderText('Buscar materias...');
    await user.type(searchInput, 'Algoritmos');

    expect(screen.getByText('Algoritmos y Estructuras')).toBeInTheDocument();
    expect(screen.queryByText('Análisis Matemático I')).not.toBeInTheDocument();
  });

  it('oculta los controles de administración si el usuario no es ADMIN', () => {
    mocks.userQuery = {
      data: { id: 2, role: 'USER' },
    };

    setup();

    expect(
      screen.queryByRole('button', { name: /\+ crear materia/i })
    ).not.toBeInTheDocument();
  });

  it('permite abrir el modal y crear una nueva materia', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: /\+ crear materia/i }));

    expect(
      screen.getByRole('heading', { name: 'Nueva Materia' })
    ).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText('Ej: Análisis Matemático I'),
      'Física I'
    );
    await user.type(
      screen.getByPlaceholderText('Descripción opcional'),
      'Mecánica clásica'
    );

    await user.click(screen.getByRole('button', { name: /confirmar/i }));

    expect(mocks.createMutate).toHaveBeenCalledTimes(1);
    expect(mocks.createMutate.mock.calls[0][0]).toEqual({
      name: 'Física I',
      description: 'Mecánica clásica',
    });
  });

  it('navega a los temas de la materia al hacer clic en "Temas"', async () => {
    const { user } = setup();

    const topicButtons = screen.getAllByRole('button', { name: /temas/i });
    await user.click(topicButtons[0]);

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/subjects/1/topics'
    );
  });
});
