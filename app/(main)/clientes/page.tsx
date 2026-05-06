"use client";

import { useState } from "react";
import { useSocios, useCreateSocio, useUpdateSocio, useDeleteSocio, useSocioById } from "@/hooks/useSocios";
import { usePagos, useCreatePago } from "@/hooks/usePagos";
import { usePlanes, useCreatePlan, useUpdatePlan, useDeletePlan } from "@/hooks/usePlanes";
import { Users, Plus, Loader2, BarChart3, Layers, Wallet, AlertTriangle } from "lucide-react";

import { DashboardSection } from "./components/sections/DashboardSection";
import { PlanesSection } from "./components/sections/PlanesSection";
import { PagosSection } from "./components/sections/PagosSection";
import { DeudasSection } from "./components/sections/DeudasSection";
import { ClienteModal } from "./components/ClienteModal";
import { PlanModal } from "./components/PlanModal";
import { PagoModal } from "./components/PagoModal";
import { ConfirmModal } from "./components/ConfirmModal";
import { ClientGroupView } from "./components/ClientGroupView";
import type { SocioConEstado } from "./types/client";
import type { GroupByOption } from "./types/client";

type Seccion = "dashboard" | "clientes" | "planes" | "pagos" | "deudas";

function SidebarNav({ seccion, onSeccionChange }: { seccion: Seccion; onSeccionChange: (s: Seccion) => void }) {
  const navItems: { id: Seccion; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "clientes", label: "Todos los Clientes", icon: <Users className="w-5 h-5" /> },
    { id: "planes", label: "Planes", icon: <Layers className="w-5 h-5" /> },
    { id: "pagos", label: "Pagos", icon: <Wallet className="w-5 h-5" /> },
    { id: "deudas", label: "Clientes con Deuda", icon: <AlertTriangle className="w-5 h-5" /> },
  ];
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSeccionChange(item.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${seccion === item.id ? "bg-violet-600 text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"}`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

type PlanType = { id: string; nombre: string; duracionDias: number; precio: number; _count?: { socios: number } };

export default function ClientesPage() {
  const [seccion, setSeccion] = useState<Seccion>("dashboard");
  const [showClienteModal, setShowClienteModal] = useState<"create" | "edit" | "view" | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: "cliente" | "plan"; id: string; nombre: string } | null>(null);
  const [selectedSocio, setSelectedSocio] = useState<SocioConEstado | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState<GroupByOption>("estado");

  const { data: socios, isLoading: loadingSocios } = useSocios("");
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

  const handleOpenCliente = (mode: "create" | "edit" | "view", socio?: SocioConEstado) => {
    setSelectedSocio(socio || null);
    setShowClienteModal(mode);
  };

  const handleCloseCliente = () => {
    setShowClienteModal(null);
    setSelectedSocio(null);
  };

  const handleOpenPlan = (plan?: PlanType) => {
    setSelectedPlan(plan || null);
    setShowPlanModal(true);
  };

  const handleClosePlan = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const handleOpenPago = (socioId: string) => {
    setShowPagoModal(socioId);
  };

  const handleClosePago = () => setShowPagoModal(null);

  const handleCreateSocio = async (data: any) => {
    try {
      await createSocio.mutateAsync({
        dni: data.dni,
        nombre: data.nombre,
        apellido: data.apellido,
        planId: data.planId,
        fechaInicio: data.fechaInicio,
        telefono: data.telefono || undefined,
        horarioEntrenamiento: data.horarioEntrenamiento,
        grupoMuscular: data.grupoMuscular || undefined,
        objetivoCliente: data.objetivoCliente || undefined,
      });
      handleCloseCliente();
    } catch (err) {
      console.error("Error al crear socio:", err);
    }
  };

  const handleUpdateSocio = async (data: any) => {
    if (!selectedSocio) return;
    try {
      await updateSocio.mutateAsync({
        id: selectedSocio.id,
        data: {
          nombre: data.nombre,
          apellido: data.apellido,
          planId: data.planId,
          telefono: data.telefono || null,
          fechaNacimiento: data.fechaNacimiento || null,
          horarioEntrenamiento: data.horarioEntrenamiento,
          grupoMuscular: data.grupoMuscular || null,
          objetivoCliente: data.objetivoCliente || null,
        },
      });
      handleCloseCliente();
    } catch (err) {
      console.error("Error al actualizar socio:", err);
    }
  };

  const handleDeleteSocio = async () => {
    if (!showDeleteConfirm || showDeleteConfirm.type !== "cliente") return;
    try {
      await deleteSocio.mutateAsync(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
      handleCloseCliente();
    } catch (err) {
      console.error("Error al eliminar socio:", err);
    }
  };

  const handleCreatePlan = async (data: { nombre: string; duracionDias: number; precio: number }) => {
    try {
      await createPlan.mutateAsync(data);
      handleClosePlan();
    } catch (err) {
      console.error("Error al crear plan:", err);
    }
  };

  const handleUpdatePlan = async (data: { nombre: string; duracionDias: number; precio: number }) => {
    if (!selectedPlan) return;
    try {
      await updatePlan.mutateAsync({ id: selectedPlan.id, data });
      handleClosePlan();
    } catch (err) {
      console.error("Error al actualizar plan:", err);
    }
  };

  const handleDeletePlan = async () => {
    if (!showDeleteConfirm || showDeleteConfirm.type !== "plan") return;
    try {
      await deletePlan.mutateAsync(showDeleteConfirm.id);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Error al eliminar plan:", err);
    }
  };

  const handleCreatePago = async (data: { monto: string; metodo: "efectivo" | "transferencia"; mes: number; anio: number }) => {
    if (!showPagoModal) return;
    try {
      await createPago.mutateAsync({
        socioId: showPagoModal,
        monto: parseFloat(data.monto),
        metodo: data.metodo,
        mes: data.mes,
        anio: data.anio,
      });
      handleClosePago();
    } catch (err) {
      console.error("Error al registrar pago:", err);
    }
  };

  const isLoading = createSocio.isPending || updateSocio.isPending || createPago.isPending || createPlan.isPending || updatePlan.isPending;
  const isDeleteLoading = deleteSocio.isPending || deletePlan.isPending;

  const filteredSocios = socios?.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.nombre.toLowerCase().includes(q) || s.apellido.toLowerCase().includes(q) || s.dni.toLowerCase().includes(q);
  }) || [];

  const renderContent = () => {
    switch (seccion) {
      case "dashboard":
        return <DashboardSection socios={socios || []} pagos={pagos || []} planes={planes || []} />;
      case "clientes":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-bold">Todos los Clientes</h2><p className="text-[var(--text-secondary)]">{filteredSocios.length} clientes registrados</p></div>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar por nombre, apellido o DNI..." className="w-full pl-4 pr-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors" />
                </div>
                <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupByOption)} className="px-4 py-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors">
                  <option value="plan">Por Plan</option>
                  <option value="horario">Por Horario</option>
                  <option value="grupoMuscular">Grupo Muscular</option>
                  <option value="estado">Por Estado</option>
                </select>
              </div>
              {filteredSocios.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-[var(--bg-secondary)]">
                  <Users className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
                  <h3 className="text-xl font-semibold mb-2">No hay clientes</h3>
                  <p className="text-[var(--text-secondary)]">{searchQuery ? "Intenta con otro término" : "Agrega tu primer cliente al sistema"}</p>
                </div>
              ) : (
                <ClientGroupView
                  socios={filteredSocios}
                  onViewClient={(s) => handleOpenCliente("view", s)}
                  onEditClient={(s) => handleOpenCliente("edit", s)}
                  onRenewClient={(s) => handleOpenPago(s.id)}
                  onNotifyClient={() => {}}
                />
              )}
            </div>
          </div>
        );
      case "planes":
        return <PlanesSection planes={planes || []} onCreatePlan={() => handleOpenPlan()} onEditPlan={(p) => handleOpenPlan(p)} onDeletePlan={(p) => setShowDeleteConfirm({ type: "plan", id: p.id, nombre: p.nombre })} />;
      case "pagos":
        return <PagosSection pagos={pagos || []} socios={socios || []} onRegisterPayment={(id) => handleOpenPago(id)} />;
      case "deudas":
        return <DeudasSection socios={socios || []} onRegisterPayment={(id) => handleOpenPago(id)} />;
      default:
        return null;
    }
  };

  if (loadingSocios) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-64 border-r border-[var(--border)] bg-[var(--bg-card)] p-4 shrink-0">
        <div className="mb-6"><h2 className="text-lg font-bold px-4">Clientes</h2></div>
        <SidebarNav seccion={seccion} onSeccionChange={setSeccion} />
      </div>

      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </div>

      {showClienteModal && (
        <ClienteModal
          mode={showClienteModal}
          socio={showClienteModal === "create" ? null : (socioDetalle || selectedSocio)}
          planes={planes || []}
          onClose={handleCloseCliente}
          onSave={showClienteModal === "create" ? handleCreateSocio : handleUpdateSocio}
          onDelete={showClienteModal !== "create" ? () => selectedSocio && setShowDeleteConfirm({ type: "cliente", id: selectedSocio.id, nombre: `${selectedSocio.nombre} ${selectedSocio.apellido}` }) : undefined}
          onRegisterPayment={showClienteModal === "view" ? () => selectedSocio && handleOpenPago(selectedSocio.id) : undefined}
          isLoading={isLoading}
        />
      )}

      {showPlanModal && (
        <PlanModal
          plan={selectedPlan}
          onClose={handleClosePlan}
          onSave={selectedPlan ? handleUpdatePlan : handleCreatePlan}
          isLoading={isLoading}
        />
      )}

      {showPagoModal && (
        <PagoModal
          socioId={showPagoModal}
          onClose={handleClosePago}
          onSave={handleCreatePago}
          isLoading={createPago.isPending}
        />
      )}

      {showDeleteConfirm?.type === "cliente" && (
        <ConfirmModal
          title="Eliminar Cliente"
          message={`¿Estás seguro de eliminar a ${showDeleteConfirm.nombre}? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteSocio}
          onCancel={() => setShowDeleteConfirm(null)}
          isLoading={isDeleteLoading}
        />
      )}

      {showDeleteConfirm?.type === "plan" && (
        <ConfirmModal
          title="Eliminar Plan"
          message={`¿Estás seguro de eliminar el plan "${showDeleteConfirm.nombre}"?`}
          onConfirm={handleDeletePlan}
          onCancel={() => setShowDeleteConfirm(null)}
          isLoading={isDeleteLoading}
        />
      )}

      {seccion === "clientes" && (
        <button
          onClick={() => handleOpenCliente("create")}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center transition-all hover:scale-105"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

