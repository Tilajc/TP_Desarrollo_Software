import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import FormModal from '@/components/FormModal';

const fields = [
  { name: 'name', label: 'Name', placeholder: 'Your name' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { value: 'ADMIN', label: 'Administrator' },
      { value: 'USER', label: 'User' },
    ],
  },
];

const setup = (props = {}) => {
  const onSubmit = vi.fn();
  const onOpenChange = vi.fn();
  const user = userEvent.setup();

  render(
    <FormModal
      open
      onOpenChange={onOpenChange}
      title="New record"
      fields={fields}
      onSubmit={onSubmit}
      {...props}
    />
  );

  return { user, onSubmit, onOpenChange };
};

describe('FormModal', () => {
  it('renders nothing when open is false', () => {
    setup({ open: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the title and one field per definition', () => {
    setup();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('New record')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });

  it('renders the select options and the default placeholder', () => {
    setup();

    expect(
      screen.getByRole('option', { name: 'Seleccione una opción...' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Administrator' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'User' })).toBeInTheDocument();
  });

  it('pre-fills the values from initialData', () => {
    setup({
      initialData: { name: 'Ana', bio: 'Teacher', role: 'USER' },
    });

    expect(screen.getByLabelText('Name')).toHaveValue('Ana');
    expect(screen.getByLabelText('Bio')).toHaveValue('Teacher');
    expect(screen.getByLabelText('Role')).toHaveValue('USER');
  });

  it('uses the field defaultValue when there is no initialData', () => {
    setup({ fields: [{ name: 'name', label: 'Name', defaultValue: 'Default value' }] });

    expect(screen.getByLabelText('Name')).toHaveValue('Default value');
  });

  it('lets the user type in fields and choose an option', async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText('Name'), 'Juan');
    await user.type(screen.getByLabelText('Bio'), 'Hello');
    await user.selectOptions(screen.getByLabelText('Role'), 'ADMIN');

    expect(screen.getByLabelText('Name')).toHaveValue('Juan');
    expect(screen.getByLabelText('Bio')).toHaveValue('Hello');
    expect(screen.getByLabelText('Role')).toHaveValue('ADMIN');
  });

  it('calls onSubmit with the form data', async () => {
    const { user, onSubmit } = setup();

    await user.type(screen.getByLabelText('Name'), 'Juan');
    await user.selectOptions(screen.getByLabelText('Role'), 'USER');
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Juan',
      bio: '',
      role: 'USER',
    });
  });

  describe('schema validation', () => {
    const schema = z.object({
      name: z.string().min(3, 'Minimum 3 characters'),
    });
    const nameField = [{ name: 'name', label: 'Name' }];

    it('shows the schema error and does not call onSubmit', async () => {
      const { user, onSubmit } = setup({ fields: nameField, schema });

      await user.type(screen.getByLabelText('Name'), 'ab');
      await user.click(screen.getByRole('button', { name: 'Confirmar' }));

      expect(screen.getByText('Minimum 3 characters')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('clears the field error when the user types again', async () => {
      const { user } = setup({ fields: nameField, schema });

      await user.type(screen.getByLabelText('Name'), 'ab');
      await user.click(screen.getByRole('button', { name: 'Confirmar' }));
      expect(screen.getByText('Minimum 3 characters')).toBeInTheDocument();

      await user.type(screen.getByLabelText('Name'), 'c');

      expect(screen.queryByText('Minimum 3 characters')).not.toBeInTheDocument();
    });

    it('submits the data when the schema is valid', async () => {
      const { user, onSubmit } = setup({ fields: nameField, schema });

      await user.type(screen.getByLabelText('Name'), 'Juan');
      await user.click(screen.getByRole('button', { name: 'Confirmar' }));

      expect(onSubmit).toHaveBeenCalledWith({ name: 'Juan' });
    });
  });

  it('shows a general server error received via props', () => {
    setup({ error: { message: 'Server error' } });

    expect(screen.getByText('Server error')).toBeInTheDocument();
  });

  it('shows a server error attached to a field', () => {
    setup({
      error: { errors: [{ field: 'name', message: 'Name already exists' }] },
    });

    expect(screen.getByText('Name already exists')).toBeInTheDocument();
  });

  it('disables the button and shows "Guardando..." while loading', () => {
    setup({ isLoading: true });

    const button = screen.getByRole('button', { name: 'Guardando...' });
    expect(button).toBeDisabled();
  });

  it('calls onOpenChange(false) when closing with the X button', async () => {
    const { user, onOpenChange } = setup();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(false) when pressing Escape', async () => {
    const { user, onOpenChange } = setup();

    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('with no fields shows only the title and confirm button (delete modal)', async () => {
    const { user, onSubmit } = setup({ fields: [], title: 'Delete?' });

    expect(screen.getByText('Delete?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    expect(onSubmit).toHaveBeenCalledWith({});
  });
});
