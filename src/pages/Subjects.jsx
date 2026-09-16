import { useState } from 'react';
import {
  useSubjects,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
} from '../hooks/useSubjects';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Subjects() {
  const { data: subjects, isLoading, isError } = useSubjects();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleOpenCreate = () => {
    setFormData({ name: '', description: '' });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name, description: subject.description || '' });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(formData, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(
      { id: editingSubject.id, data: formData },
      { onSuccess: () => setEditingSubject(null) }
    );
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="p-4">Cargando materias...</p>;
  if (isError)
    return <p className="p-4 text-red-500">Error al cargar las materias.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Materias</h1>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>+ Crear Materia</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Materia</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Análisis Matemático I"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripción de la materia"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Guardando...' : 'Crear'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects?.map((subject) => (
          <Card key={subject.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{subject.name}</CardTitle>
              <CardDescription>
                {subject.description || 'Sin descripción'}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(subject)}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(subject.id)}
                disabled={deleteMutation.isPending}
              >
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog
        open={Boolean(editingSubject)}
        onOpenChange={(open) => !open && setEditingSubject(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Materia</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
