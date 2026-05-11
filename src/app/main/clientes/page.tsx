'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useSocios,
  useCreateSocio,
  useUpdateSocio,
  useDeleteSocio,
  useSocioById,
} from '@/hooks/useSocios';
import { usePagos, useCreatePago } from '@/hooks/usePagos';
import { usePlanes, useCreatePlan, useUpdatePlan, useDeletePlan } from '@/hooks/usePlanes';
import { Users, Plus, Loader2, BarChart3, Layers, Wallet, AlertTriangle, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

import { DashboardSection } from './components/sections/DashboardSection';
import { PlanesSection } from './components/sections/PlanesSection';
import { PagosSection } from './components/sections/PagosSection';
import { DeudasSection } from './components/sections/DeudasSection';
import { ClienteModal } from './components/ClienteModal';
import { PlanModal } from './components/PlanModal';
import { PagoModal } from './components/PagoModal';
import { ConfirmModal } from './components/ConfirmModal';
import { ClientGroupView } from './components/ClientGroupView';
import type { SocioConEstado, PlanType } from './types/client';
import type { GroupByOption } from './types/client';

type Seccion = 'dashboard' | 'clientes' | 'planes' | 'pagos' | 'deudas';

function TopNav({
  seccion,
  onSeccionChange,
}: {
  seccion: Seccion;
  onSeccionChange: (s: Seccion) => void;
}) {
  const items: { id: Seccion; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Resumen', icon: BarChart3 },
    { id: 'clientes', label: 'Socios', icon: Users },
    { id: 'planes', label: 'Planes', icon: Layers },
    { id: 'pagos', label: 'Pagos', icon: Wallet },
    { id: 'deudas', label: 'Deudas', icon: AlertTriangle },
  ];

  return (
    <>
      {/* Desktop: Tabs */}
      <div className="hidden md:flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSeccionChange(item.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-150',
              seccion === item.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            <item.icon size={16} className={seccion === item.id ? 'text-primary' : ''} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile: Dropdown Select */}
      <div className="md:hidden w-full">
        <select
          value={seccion}
          onChange={(e) => onSeccionChange(e.target.value as Seccion)}
          className="w-full min-h-11 px-4 pr-10 rounded-lg bg-background border border-input text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Seleccionar sección"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}


export default function ClientesPage() {
  const searchParams = useSearchParams();
  const [seccion, setSeccion] = useState<Seccion>('dashboard');
  const [showClienteModal, setShowClienteModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'cliente' | 'plan';
    id: string;
    nombre: string;
  } | null>(null);
  const [selectedSocio, setSelectedSocio] = useState<SocioConEstado | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<GroupByOption>('estado');

  const { data: socios, isLoading: loadingSocios } = useSocios('');
  const { data: pagos } = usePagos();
  const { data: planes } = usePlanes();
  const createSocio = useCreateSocio();
  const updateSocio = useUpdateSocio();
  const deleteSocio = useDeleteSocio();
  const createPago = useCreatePago();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();

  const { data: socioDetalle } = useSocioById(selectedSocio?.id || null);

  useEffect(() => {
    const fichadoId = searchParams.get('fichado');
    if (fichadoId && socios) {
      const socio = socios.find((s) => s.id === fichadoId);
      if (socio) {
        setSelectedSocio(socio);
        setShowClienteModal('view');
      }
    }
  }, [searchParams, socios]);

  const handleCloseCliente = () => {
    setShowClienteModal(null);
    setSelectedSocio(null);
  };

  const handleClosePlan = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const handleClosePago = () => setShowPagoModal(null);

  const sectionTitles: Record<Seccion, string> = {
    dashboard: 'Resumen',
    clientes: 'Todos los Socios',
    planes: 'Planes',
    pagos: 'Pagos',
    deudas: 'Deudas',
  };

  const sectionDescriptions: Record<Seccion, string> = {
    dashboard: 'Visualiza el rendimiento de tu gimnasio en tiempo real.',
    clientes: 'Gestiona tu base completa de socios y su información.',
    planes: 'Configura planes de suscripción, precios y duraciones.',
    pagos: 'Control detallado de transacciones e historial.',
    deudas: 'Gestión de cobranzas y alertas de vencimiento.',
  };

return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
        {/* Header */}
        <header className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 relative z-20 shrink-0 border-b border-border/60 bg-background">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Clientes</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">{socios?.length || 0} socios registrados</p>
            </div>
          </div>

          <div className="w-full lg:w-auto overflow-x-auto">
            <TopNav seccion={seccion} onSeccionChange={setSeccion} />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <button
              onClick={() => setShowClienteModal('create')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90"
            >
              <Plus size={16} />
              <span>Añadir Socio</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Page Title */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-heading text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-3">
                {sectionTitles[seccion]}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {sectionDescriptions[seccion]}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={seccion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {loadingSocios ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm">Cargando datos...</p>
                  </div>
                ) : (
                  <>
                    {seccion === 'dashboard' && (
                      <DashboardSection
                        socios={socios || []}
                        pagos={pagos || []}
                        planes={planes || []}
                      />
                    )}
                    {seccion === 'clientes' && (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Buscar por nombre, apellido o DNI..."
                              className="w-full min-h-11 pl-4 pr-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <div className="flex gap-2">
                            {(['estado', 'plan'] as GroupByOption[]).map((opt) => (
                              <button
                                key={opt}
                                onClick={() => setGroupBy(opt)}
                                className={cn(
                                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                  groupBy === opt ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                              >
                                {opt === 'estado' ? 'Por Estado' : 'Por Plan'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <ClientGroupView
                          socios={socios || []}
                          onViewClient={(s) => {
                            setSelectedSocio(s);
                            setShowClienteModal('view');
                          }}
                          onEditClient={(s) => {
                            setSelectedSocio(s);
                            setShowClienteModal('edit');
                          }}
                          onRenewClient={(s) =>
                            setShowDeleteConfirm({ type: 'cliente', id: s.id, nombre: s.nombre })
                          }
                          onNotifyClient={(s) => setShowPagoModal(s.id)}
                        />
                      </div>
                    )}
                    {seccion === 'planes' && (
                      <PlanesSection
                        planes={planes || []}
                        onCreatePlan={() => {
                          setSelectedPlan(null);
                          setShowPlanModal(true);
                        }}
                        onEditPlan={(p) => {
                          setSelectedPlan(p);
                          setShowPlanModal(true);
                        }}
                        onDeletePlan={(p) =>
                          setShowDeleteConfirm({ type: 'plan', id: p.id, nombre: p.nombre })
                        }
                      />
                    )}
                    {seccion === 'pagos' && (
                      <PagosSection
                        pagos={pagos || []}
                      />
                    )}
                    {seccion === 'deudas' && (
                      <DeudasSection
                        socios={socios || []}
                        onRegisterPayment={(id) => setShowPagoModal(id)}
                      />
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      {/* Modals */}
      {showClienteModal && (
        <ClienteModal
          mode={showClienteModal}
          socio={showClienteModal === 'create' ? null : socioDetalle || selectedSocio}
          planes={planes || []}
          onClose={handleCloseCliente}
          onSave={async (data) => {
            try {
              if (showClienteModal === 'edit' && selectedSocio) {
                await updateSocio.mutateAsync({ id: selectedSocio.id, data });
              } else {
                await createSocio.mutateAsync(data);
              }
              handleCloseCliente();
            } catch (error) {
              console.error('Error saving socio:', error);
            }
          }}
          onDelete={(id) => {
            const socio = socios?.find(s => s.id === id);
            if (socio) {
              setShowDeleteConfirm({ type: 'cliente', id, nombre: socio.nombre });
            }
          }}
          onRegisterPayment={() => {
            if (selectedSocio) {
              setShowPagoModal(selectedSocio.id);
            }
          }}
          isLoading={createSocio.isPending || updateSocio.isPending}
        />
      )}

      {showPlanModal && (
        <PlanModal
          onClose={handleClosePlan}
          onSave={async (data) => {
            try {
              if (selectedPlan && selectedPlan.id) {
                await updatePlan.mutateAsync({ id: selectedPlan.id, data });
              } else {
                await createPlan.mutateAsync(data);
              }
              handleClosePlan();
            } catch (error) {
              console.error('Error saving plan:', error);
            }
          }}
          plan={selectedPlan}
          isLoading={createPlan.isPending || updatePlan.isPending}
        />
      )}

      {showPagoModal && (
        <PagoModal
          socioId={showPagoModal}
          onClose={() => setShowPagoModal(null)}
          onSave={async (data) => {
            try {
              await createPago.mutateAsync({
                socioId: showPagoModal,
                monto: parseFloat(data.monto),
                metodo: data.metodo,
                mes: data.mes,
                anio: data.anio,
              });
              setShowPagoModal(null);
            } catch (error) {
              console.error('Error saving pago:', error);
            }
          }}
          isLoading={createPago.isPending}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={async () => {
            if (!showDeleteConfirm) return;
            try {
              if (showDeleteConfirm.type === 'cliente') {
                await deleteSocio.mutateAsync(showDeleteConfirm.id);
                handleCloseCliente();
              } else {
                await deletePlan.mutateAsync(showDeleteConfirm.id);
              }
              setShowDeleteConfirm(null);
            } catch (error) {
              console.error('Error deleting:', error);
            }
          }}
          title={`Eliminar ${showDeleteConfirm.type === 'cliente' ? 'Cliente' : 'Plan'}`}
          message={`¿Estás seguro de que deseas eliminar a ${showDeleteConfirm.nombre}? Esta acción no se puede deshacer.`}
          isLoading={deleteSocio.isPending || deletePlan.isPending}
        />
      )}
    </div>
  );
}
