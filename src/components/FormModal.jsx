import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const FormModal = ({
  open,
  onOpenChange,
  title,
  fields = [],
  initialData = null,
  schema,
  onSubmit,
  error,
  isLoading,
}) => {
  const [formData, setFormData] = useState(() => {
    const defaultState = {};
    fields.forEach((field) => {
      defaultState[field.name] =
        initialData?.[field.name] ?? field.defaultValue ?? '';
    });
    return defaultState;
  });

  const [localError, setLocalError] = useState(null);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError((prev) =>
      prev ? { errors: prev.errors.filter((err) => err.field !== name) } : prev
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (schema) {
      const result = schema.safeParse(formData);

      if (!result.success) {
        setLocalError({
          errors: result.error.issues.map((issue) => ({
            field: issue.path[0],
            message: issue.message,
          })),
        });
        return;
      }
    }

    setLocalError(null);
    onSubmit(formData);
  };

  const shownError = localError || error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>

              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="max-h-40"
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option
                    value=""
                    disabled
                    className="text-gray-500 bg-white dark:bg-zinc-900"
                  >
                    {field.placeholder || 'Seleccione una opción...'}
                  </option>
                  {field.options?.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.name}
                  type={field.type || 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
              {shownError && (
                <p className="text-sm text-red-700">
                  {
                    shownError.errors?.find((err) => err.field === field.name)
                      ?.message
                  }
                </p>
              )}
            </div>
          ))}

          {shownError && !shownError.errors?.length && shownError.message && (
            <p className="text-sm text-red-700">{shownError.message}</p>
          )}

          <DialogFooter className="pt-2">
            <Button
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
