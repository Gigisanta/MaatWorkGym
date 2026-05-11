'use client';

import { useState } from 'react';
import { Plus, Loader2, Search, LayoutGrid, Users, Apple } from 'lucide-react';
import { useDietas, useCreateDieta, useUpdateDieta, useDeleteDieta, useAsignarDieta } from '@/hooks/useDietas';
import { useSocios } from '@/hooks/useSocios';
import { DietaCreator } from './components/DietaCreator';
import { AsignarDietaModal } from './components/AsignarDietaModal';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type TabType = 'genericas' | 'asignadas';

function DietaCardSimple({ dieta, onEdit, onDelete, onAsignar }: {
  dieta: any;
  onEdit: () => void;
  onDelete: () => void;
  onAsignar: () => void;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center text-success">
            <Apple size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{dieta.nombre}</h3>
            <p className="text-sm text-muted-foreground">{dieta.comidas?.length || 0} comidas</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">Editar</button>
          <button onClick={onAsignar} className="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors">Asignar</button>
          <button onClick={onDelete} className="px-3 py-1.5 text-sm bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors">Eliminar</button>
        </div>
      </div>
      {dieta.descripcion && (
        <p className="mt-3 text-sm text-muted-foreground">{dieta.descripcion}</p>
      )}
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Apple size={28} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  );
}

export default function DietasPage() {
  const [tab, setTab] = useState<TabType>('genericas');
  const [showCreator, setShowCreator] = useState(false);
  const [editingDieta, setEditingDieta] = useState<any>(null);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [dietaParaAsignar, setDietaParaAsignar] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: dietas, isLoading } = useDietas();
  const { data: socios } = useSocios();
  const createDieta = useCreateDieta();
  const updateDieta = useUpdateDieta();
  const deleteDieta = useDeleteDieta();
  const asignarDieta = useAsignarDieta();

  const dietasFiltradas = dietas?.filter(d => {
    const matchesTab = tab === 'genericas'
      ? (d.tipo === 'generica' && !d.socioId)
      : (d.tipo === 'personalizada' || d.socioId || d.asignaciones?.length > 0);

    const matchesSearch = d.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  }) || [];

  const handleSave = async (data: { nombre: string; descripcion?: string; comidas: any[] }) => {
    try {
      if (editingDieta?.id) {
        await updateDieta.mutateAsync({ id: editingDieta.id, data });
      } else {
        await createDieta.mutateAsync(data);
      }
      setShowCreator(false);
      setEditingDieta(null);
    } catch (error) {
      console.error('Error guardando dieta:', error);
    }
  };

  const handleEdit = (dieta: any) => {
    setEditingDieta(dieta);
    setShowCreator(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta dieta?')) {
      try {
        await deleteDieta.mutateAsync(id);
      } catch (error) {
        console.error('Error eliminando dieta:', error);
      }
    }
  };

  const handleAsignar = (dieta: any) => {
    setDietaParaAsignar(dieta);
    setShowAsignarModal(true);
  };

  const handleConfirmAsignar = async (socioId: string) => {
    if (!dietaParaAsignar) return;
    try {
      await asignarDieta.mutateAsync({ dietaId: dietaParaAsignar.id, socioId });
      setShowAsignarModal(false);
      setDietaParaAsignar(null);
    } catch (error) {
      console.error('Error asignando dieta:', error);
    }
  };

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
      {/* Header */}
      <header className="px-6 py-6 shrink-0 border-b border-border bg-background">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Apple className="text-success" />
              Dietas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Planes de alimentación para tus socios</p>
          </div>

          <button
            onClick={() => { setEditingDieta(null); setShowCreator(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-success text-success-foreground rounded-xl font-medium hover:bg-success/90 transition-colors"
          >
            <Plus size={18} />
            Nueva Dieta
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
              placeholder="Buscar dietas..."
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
            <p className="text-muted-foreground">Cargando dietas...</p>
          </div>
        ) : dietasFiltradas.length === 0 ? (
          <EmptyState
            title={searchQuery ? 'Sin resultados' : 'Sin dietas creadas'}
            message={searchQuery ? 'No encontramos dietas con ese nombre.' : 'Crea tu primera dieta para comenzar.'}
          />
        ) : (
          <div className="space-y-4">
            {dietasFiltradas.map((dieta) => (
              <DietaCardSimple
                key={dieta.id}
                dieta={dieta}
                onEdit={() => handleEdit(dieta)}
                onDelete={() => handleDelete(dieta.id)}
                onAsignar={() => handleAsignar(dieta)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreator && (
        <DietaCreator
          open={showCreator}
          onOpenChange={setShowCreator}
          dieta={editingDieta}
          onSave={handleSave}
          isLoading={createDieta.isPending || updateDieta.isPending}
        />
      )}

      {showAsignarModal && dietaParaAsignar && (
        <AsignarDietaModal
          open={showAsignarModal}
          onOpenChange={setShowAsignarModal}
          dieta={dietaParaAsignar}
          socios={socios || []}
          onAsignar={handleConfirmAsignar}
          isLoading={asignarDieta.isPending}
        />
      )}
    </div>
  );
}
