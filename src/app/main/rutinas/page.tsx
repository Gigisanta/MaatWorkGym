'use client';

import { useState } from 'react';
import { Plus, Loader2, Search, LayoutGrid, Users, Dumbbell } from 'lucide-react';
import { useRutinas, useCreateRutina, useUpdateRutina, useDeleteRutina, useAsignarRutina } from '@/hooks/useRutinas';
import { useSocios } from '@/hooks/useSocios';
import { RutinaCreator } from './components/RutinaCreator';
import { AsignarRutinaModal } from './components/AsignarRutinaModal';
import { cn } from '@/lib/utils';

type TabType = 'genericas' | 'asignadas';

function RutinaCardSimple({ rutina, onEdit, onDelete, onAsignar }: {
  rutina: any;
  onEdit: () => void;
  onDelete: () => void;
  onAsignar: () => void;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Dumbbell size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{rutina.nombre}</h3>
            <p className="text-sm text-muted-foreground">{rutina.dias?.length || 0} días</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">Editar</button>
          <button onClick={onAsignar} className="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors">Asignar</button>
          <button onClick={onDelete} className="px-3 py-1.5 text-sm bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors">Eliminar</button>
        </div>
      </div>
      {rutina.descripcion && (
        <p className="mt-3 text-sm text-muted-foreground">{rutina.descripcion}</p>
      )}
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Dumbbell size={28} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  );
}

export default function RutinasPage() {
  const [tab, setTab] = useState<TabType>('genericas');
  const [showCreator, setShowCreator] = useState(false);
  const [editingRutina, setEditingRutina] = useState<any>(null);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [rutinaParaAsignar, setRutinaParaAsignar] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: rutinas, isLoading } = useRutinas();
  const { data: socios } = useSocios();
  const createRutina = useCreateRutina();
  const updateRutina = useUpdateRutina();
  const deleteRutina = useDeleteRutina();
  const asignarRutina = useAsignarRutina();

  const rutinasFiltradas = rutinas?.filter(r => {
    const matchesTab = tab === 'genericas'
      ? (r.tipo === 'generica' && !r.socioId)
      : (r.tipo === 'personalizada' || r.socioId || r.asignaciones?.length > 0);

    const matchesSearch = r.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  }) || [];

  const handleSave = async (data: { nombre: string; descripcion?: string; dias: any[] }) => {
    try {
      if (editingRutina?.id) {
        await updateRutina.mutateAsync({ id: editingRutina.id, data });
      } else {
        await createRutina.mutateAsync(data);
      }
      setShowCreator(false);
      setEditingRutina(null);
    } catch (error) {
      console.error('Error guardando rutina:', error);
    }
  };

  const handleEdit = (rutina: any) => {
    setEditingRutina(rutina);
    setShowCreator(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta rutina?')) {
      try {
        await deleteRutina.mutateAsync(id);
      } catch (error) {
        console.error('Error eliminando rutina:', error);
      }
    }
  };

  const handleAsignar = (rutina: any) => {
    setRutinaParaAsignar(rutina);
    setShowAsignarModal(true);
  };

  const handleConfirmAsignar = async (data: { rutinaId: string; socioId: string; parametros?: Record<string, any> }) => {
    if (!rutinaParaAsignar) return;
    try {
      await asignarRutina.mutateAsync({ ...data, rutinaId: rutinaParaAsignar.id });
      setShowAsignarModal(false);
      setRutinaParaAsignar(null);
    } catch (error) {
      console.error('Error asignando rutina:', error);
    }
  };

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
      {/* Header */}
      <header className="px-6 py-6 shrink-0 border-b border-border bg-background">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Dumbbell className="text-primary" />
              Rutinas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Planes de entrenamiento para tus socios</p>
          </div>

          <button
            onClick={() => { setEditingRutina(null); setShowCreator(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nueva Rutina
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="mt-6 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar rutinas..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div className="flex gap-1 p-1 rounded-xl bg-muted">
            <button
              onClick={() => setTab('genericas')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === 'genericas' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid size={16} />
              Genéricas
            </button>
            <button
              onClick={() => setTab('asignadas')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === 'asignadas' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Users size={16} />
              Asignadas
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Cargando rutinas...</p>
          </div>
        ) : rutinasFiltradas.length === 0 ? (
          <EmptyState
            title={searchQuery ? 'Sin resultados' : 'Sin rutinas creadas'}
            message={searchQuery ? 'No encontramos rutinas con ese nombre.' : 'Crea tu primera rutina para comenzar.'}
          />
        ) : (
          <div className="space-y-4">
            {rutinasFiltradas.map((rutina) => (
              <RutinaCardSimple
                key={rutina.id}
                rutina={rutina}
                onEdit={() => handleEdit(rutina)}
                onDelete={() => handleDelete(rutina.id)}
                onAsignar={() => handleAsignar(rutina)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreator && (
        <RutinaCreator
          open={showCreator}
          onOpenChange={setShowCreator}
          rutina={editingRutina}
          onSave={handleSave}
          isLoading={createRutina.isPending || updateRutina.isPending}
        />
      )}

      {showAsignarModal && rutinaParaAsignar && (
        <AsignarRutinaModal
          open={showAsignarModal}
          onOpenChange={setShowAsignarModal}
          rutina={rutinaParaAsignar}
          socios={socios || []}
          onAsignar={handleConfirmAsignar}
          isLoading={asignarRutina.isPending}
        />
      )}
    </div>
  );
}
