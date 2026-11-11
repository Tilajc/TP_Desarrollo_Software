import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/pages/Login';
import useLoginStatus from '@/store/useLoginStatus';
import { renderWithProviders } from '../../test-utils';

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  resetCaptcha: vi.fn(),
  mutation: { isPending: false, error: null },
}));

vi.mock('@/hooks/useAuth', () => ({
  useLogin: () => ({
    mutate: mocks.mutate,
    isPending: mocks.mutation.isPending,
    error: mocks.mutation.error,
  }),
}));

vi.mock('@marsidev/react-turnstile', async () => {
  const React = await import('react');
  const Turnstile = React.forwardRef(function Turnstile({ onSuccess }, ref) {
    React.useImperativeHandle(ref, () => ({ reset: mocks.resetCaptcha }));
    return React.createElement(
      'button',
      { type: 'button', onClick: () => onSuccess('token-123') },
      'Solve captcha'
    );
  });
  return { Turnstile };
});

const setup = () => {
  const user = userEvent.setup();
  renderWithProviders(<Login />, { route: '/login' });
  return {
    user,
    email: screen.getByPlaceholderText('pepe@garcia.com'),
    password: screen.getByPlaceholderText('********'),
    submit: () => screen.getByRole('button', { name: /ingresar|iniciando/i }),
  };
};

describe('Login', () => {
  beforeEach(() => {
    mocks.mutate.mockReset();
    mocks.mutation.isPending = false;
    mocks.mutation.error = null;
    useLoginStatus.setState({ isLoggedIn: false });
  });

  it('renders the title, the fields and the signup link', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('pepe@garcia.com')).toHaveAttribute(
      'type',
      'email'
    );
    expect(screen.getByPlaceholderText('********')).toHaveAttribute(
      'type',
      'password'
    );
    expect(
      screen.getByRole('link', { name: /registrate aquí/i })
    ).toHaveAttribute('href', '/signup');
  });

  it('updates the fields while the user types', async () => {
    const { user, email, password } = setup();

    await user.type(email, 'ana@test.com');
    await user.type(password, 'secret');

    expect(email).toHaveValue('ana@test.com');
    expect(password).toHaveValue('secret');
  });

  it('requires solving the captcha before submitting', async () => {
    const { user, email, password, submit } = setup();

    await user.type(email, 'ana@test.com');
    await user.type(password, 'secret');
    await user.click(submit());

    expect(
      screen.getByText(/completa la verificación del captcha/i)
    ).toBeInTheDocument();
    expect(mocks.mutate).not.toHaveBeenCalled();
  });

  it('sends email, password and captcha token', async () => {
    const { user, email, password, submit } = setup();

    await user.type(email, 'ana@test.com');
    await user.type(password, 'secret');
    await user.click(screen.getByRole('button', { name: 'Solve captcha' }));
    await user.click(submit());

    expect(mocks.mutate).toHaveBeenCalledTimes(1);
    expect(mocks.mutate.mock.calls[0][0]).toEqual({
      email: 'ana@test.com',
      password: 'secret',
      turnstileToken: 'token-123',
    });
  });

  it('on success stores the token, marks the session as logged in and navigates to "/"', async () => {
    mocks.mutate.mockImplementation((_data, { onSuccess }) =>
      onSuccess({ token: 'jwt-abc' })
    );
    const { user, email, password, submit } = setup();

    await user.type(email, 'ana@test.com');
    await user.type(password, 'secret');
    await user.click(screen.getByRole('button', { name: 'Solve captcha' }));
    await user.click(submit());

    expect(localStorage.getItem('token')).toBe('jwt-abc');
    expect(useLoginStatus.getState().isLoggedIn).toBe(true);
    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });

  it('on failure resets the captcha', async () => {
    mocks.mutate.mockImplementation((_data, { onError }) => onError());
    const { user, email, password, submit } = setup();

    await user.type(email, 'ana@test.com');
    await user.type(password, 'secret');
    await user.click(screen.getByRole('button', { name: 'Solve captcha' }));
    await user.click(submit());

    expect(mocks.resetCaptcha).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('location')).toHaveTextContent('/login');
  });

  it('shows the error message returned by the server', () => {
    mocks.mutation.error = { message: 'Invalid credentials' };
    setup();

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('disables the button and changes its text while logging in', () => {
    mocks.mutation.isPending = true;
    setup();

    const button = screen.getByRole('button', { name: 'Iniciando sesión...' });
    expect(button).toBeDisabled();
  });
});
