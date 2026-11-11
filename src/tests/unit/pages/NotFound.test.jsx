import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotFound from '@/pages/NotFound';
import { renderWithProviders } from '../../test-utils';

describe('NotFound', () => {
  it('shows the 404 code and the not-found message', () => {
    renderWithProviders(<NotFound />, { route: '/non-existent-route' });

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Página no encontrada' })
    ).toBeInTheDocument();
  });

  it('has a link back to the home page', () => {
    renderWithProviders(<NotFound />, { route: '/non-existent-route' });

    expect(
      screen.getByRole('link', { name: /volver al inicio/i })
    ).toHaveAttribute('href', '/');
  });

  it('navigates to "/" when clicking "Volver al Inicio"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotFound />, { route: '/non-existent-route' });

    await user.click(screen.getByRole('link', { name: /volver al inicio/i }));

    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });
});
