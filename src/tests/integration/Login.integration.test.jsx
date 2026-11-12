import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
} from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import Login from '@/pages/Login';
import useLoginStatus from '@/store/useLoginStatus';
import { renderWithProviders } from '../test-utils';
import { server, url } from '../msw/server';

const mocks = vi.hoisted(() => ({ resetCaptcha: vi.fn() }));

vi.mock('@marsidev/react-turnstile', async () => {
  const React = await import('react');
  const Turnstile = React.forwardRef(function Turnstile({ onSuccess }, ref) {
    React.useImperativeHandle(ref, () => ({ reset: mocks.resetCaptcha }));
    return React.createElement(
      'button',
      { type: 'button', onClick: () => onSuccess('captcha-token') },
      'Solve captcha'
    );
  });
  return { Turnstile };
});

const fillAndSubmit = async (user) => {
  await user.type(
    screen.getByPlaceholderText('pepe@garcia.com'),
    'ana@test.com'
  );
  await user.type(screen.getByPlaceholderText('********'), 'secret1');
  await user.click(screen.getByRole('button', { name: 'Solve captcha' }));
  await user.click(screen.getByRole('button', { name: 'Ingresar' }));
};

describe('Login flow (integration, network mocked with MSW)', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    useLoginStatus.setState({ isLoggedIn: false });
  });

  it('logs in: posts the credentials, stores the token and redirects home', async () => {
    let received;
    server.use(
      http.post(url('/auth/login'), async ({ request }) => {
        received = await request.json();
        return HttpResponse.json({ token: 'jwt-123' });
      })
    );
    const user = userEvent.setup();
    renderWithProviders(<Login />, { route: '/login' });

    await fillAndSubmit(user);

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
    );
    expect(received).toEqual({
      email: 'ana@test.com',
      password: 'secret1',
      turnstileToken: 'captcha-token',
    });
    expect(localStorage.getItem('token')).toBe('jwt-123');
    expect(useLoginStatus.getState().isLoggedIn).toBe(true);
  });

  it('shows the server message, resets the captcha and stays on /login when credentials are wrong', async () => {
    server.use(
      http.post(url('/auth/login'), () =>
        HttpResponse.json({ message: 'Invalid credentials' }, { status: 400 })
      )
    );
    const user = userEvent.setup();
    renderWithProviders(<Login />, { route: '/login' });

    await fillAndSubmit(user);

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    expect(mocks.resetCaptcha).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('location')).toHaveTextContent('/login');
    expect(localStorage.getItem('token')).toBeNull();
    expect(useLoginStatus.getState().isLoggedIn).toBe(false);
  });

  it('shows a connection message when the server is unreachable', async () => {
    server.use(http.post(url('/auth/login'), () => HttpResponse.error()));
    const user = userEvent.setup();
    renderWithProviders(<Login />, { route: '/login' });

    await fillAndSubmit(user);

    expect(
      await screen.findByText(/no se pudo establecer conexión/i)
    ).toBeInTheDocument();
  });

  it('does not hit the API if the captcha was not solved', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />, { route: '/login' });

    await user.type(
      screen.getByPlaceholderText('pepe@garcia.com'),
      'ana@test.com'
    );
    await user.type(screen.getByPlaceholderText('********'), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      screen.getByText(/completa la verificación del captcha/i)
    ).toBeInTheDocument();
  });
});
