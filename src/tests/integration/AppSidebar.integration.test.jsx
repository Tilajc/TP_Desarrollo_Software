import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import useLoginStatus from '@/store/useLoginStatus';
import { renderWithProviders } from '../test-utils';
import { server, url } from '../msw/server';

const renderSidebar = (route = '/') =>
  renderWithProviders(
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>,
    { route }
  );

const loginAs = (role) => {
  localStorage.setItem('token', 'test-token');
  useLoginStatus.setState({ isLoggedIn: true });
  server.use(
    http.get(url('/auth/me'), () => HttpResponse.json({ id: 1, role }))
  );
};

describe('AppSidebar + auth (integration, network mocked with MSW)', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  beforeEach(() => useLoginStatus.setState({ isLoggedIn: false }));

  it('shows the ADMIN menu once /auth/me returns an admin', async () => {
    loginAs('ADMIN');
    renderSidebar();

    expect(
      await screen.findByRole('link', { name: 'Usuarios' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cursos' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Tarjetas' })
    ).not.toBeInTheDocument();
  });

  it('shows the USER menu once /auth/me returns a regular user', async () => {
    loginAs('USER');
    renderSidebar();

    expect(
      await screen.findByRole('link', { name: 'Mis Cursos' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Usuarios' })
    ).not.toBeInTheDocument();
  });

  it('falls back to the logged-out menu when /auth/me answers 401 (expired token)', async () => {
    localStorage.setItem('token', 'expired');
    useLoginStatus.setState({ isLoggedIn: true });
    server.use(
      http.get(url('/auth/me'), () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
      )
    );
    renderSidebar();

    expect(
      await screen.findByRole('link', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
    expect(useLoginStatus.getState().isLoggedIn).toBe(false);
  });

  it('logout clears the session and the query cache, then shows the login links', async () => {
    loginAs('ADMIN');
    const user = userEvent.setup();
    renderSidebar('/users');
    await screen.findByRole('link', { name: 'Usuarios' });

    await user.click(screen.getByRole('button', { name: 'Cerrar Sesión' }));

    expect(
      await screen.findByRole('link', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Usuarios' })
    ).not.toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/);
  });

  it('does not request /auth/me when there is no token', () => {
    renderSidebar();

    // No handler registered + onUnhandledRequest "error": a request would fail the test.
    expect(
      screen.getByRole('link', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
  });
});
