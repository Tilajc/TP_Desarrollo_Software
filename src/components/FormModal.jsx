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

const FormModal = ({
  open,
  onOpenChange,
  title,
  fields = [],
  initialData = null,
  onSubmit,
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

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
              <Input
                id={field.name}
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
              />
            </div>
          ))}

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
