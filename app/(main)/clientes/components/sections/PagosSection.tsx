"use client";
import { useState, useMemo } from "react";
import { Search, DollarSign, CreditCard, Receipt, Calendar } from "lucide-react";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function Badge({ variant = "default", children }: { variant?: "default" | "success" | "warning"; children: React.ReactNode }) {
  const variants: Record<string, string> = {
    default: "bg-[var(--bg-secondary)] text-[var(--text-secondary)]",
    success: "bg-emerald-500/10 text-emerald-400",
    warning: "bg-amber-500/10 text-amber-400"
  };
  return <span className={`px-2 py-1 rounded-lg text-sm font-medium ${variants[variant]}`}>{children}</span>;
}

function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const initials = `${nombre[0]}${apellido[0]}`;
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
      {initials}
    </div>
  );
}

interface PagoType { id: string; socioId: string; monto: number; metodo: string; mes: number; anio: number; fechaPago: Date; socio?: { nombre: string; apellido: string; dni: string } }
interface SocioType { id: string; nombre: string; apellido: string; dni: string; tieneDeuda: boolean }

interface PagosSectionProps {
  pagos: PagoType[];
  socios: SocioType[];
  onRegisterPayment: (socioId: string) => void;
}

export function PagosSection({ pagos, socios, onRegisterPayment }: PagosSectionProps) {
  const [filterMes, setFilterMes] = useState(new Date().getMonth() + 1);
  const [filterAnio, setFilterAnio] = useState(new Date().getFullYear());
  const [searchSocio, setSearchSocio] = useState("");

  const filteredPagos = useMemo(() => {
    return pagos.filter((p) => {
      if (p.mes !== filterMes || p.anio !== filterAnio) return false;
      if (searchSocio.trim()) {
        const fullName = `${p.socio?.nombre || ""} ${p.socio?.apellido || ""}`.toLowerCase();
        return fullName.includes(searchSocio.toLowerCase());
      }
      return true;
    });
  }, [pagos, filterMes, filterAnio, searchSocio]);

  const totalPagos = filteredPagos.reduce((sum, p) => sum + p.monto, 0);
  const pagosEfectivo = filteredPagos.filter((p) => p.metodo === "efectivo").reduce((sum, p) => sum + p.monto, 0);
  const pagosTransferencia = filteredPagos.filter((p) => p.metodo === "transferencia").reduce((sum, p) => sum + p.monto, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">Pagos</h2><p className="text-[var(--text-secondary)]">Historial de pagos registrados</p></div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <select value={filterMes} onChange={(e) => setFilterMes(parseInt(e.target.value))} className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors text-sm">
              {MESES.map((mes, i) => (<option key={i} value={i + 1}>{mes}</option>))}
            </select>
            <select value={filterAnio} onChange={(e) => setFilterAnio(parseInt(e.target.value))} className="px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors text-sm">
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
            </select>
          </div>
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input type="text" value={searchSocio} onChange={(e) => setSearchSocio(e.target.value)} placeholder="Buscar por cliente..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-violet-500 focus:outline-none transition-colors text-sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center">
          <DollarSign className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <p className="text-2xl font-bold">${totalPagos.toLocaleString()}</p>
          <p className="text-sm text-[var(--text-secondary)]">Total</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-emerald-500/10 flex items-center justify-center"><span className="text-emerald-400 text-xs font-bold">$</span></div>
          <p className="text-2xl font-bold text-emerald-400">${pagosEfectivo.toLocaleString()}</p>
          <p className="text-sm text-[var(--text-secondary)]">Efectivo</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-blue-500/10 flex items-center justify-center"><CreditCard className="w-4 h-4 text-blue-400" /></div>
          <p className="text-2xl font-bold text-blue-400">${pagosTransferencia.toLocaleString()}</p>
          <p className="text-sm text-[var(--text-secondary)]">Transferencia</p>
        </div>
      </div>

      {filteredPagos.length === 0 ? (
        <div className="text-center py-20 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
          <h3 className="text-xl font-semibold mb-2">Sin pagos</h3>
          <p className="text-[var(--text-secondary)]">No hay pagos registrados para este período</p>
        </div>
      ) : (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-[var(--border)]"><th className="text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">Cliente</th><th className="text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">Fecha</th><th className="text-left px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">Método</th><th className="text-right px-4 py-3 text-sm font-medium text-[var(--text-secondary)]">Monto</th></tr></thead>
              <tbody>
                {filteredPagos.map((pago) => (
                  <tr key={pago.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar nombre={pago.socio?.nombre || "?"} apellido={pago.socio?.apellido || "?"} />
                        <div><p className="font-medium text-sm">{pago.socio?.nombre} {pago.socio?.apellido}</p><p className="text-xs text-[var(--text-secondary)]">{pago.socio?.dni}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(pago.fechaPago).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}</td>
                    <td className="px-4 py-3"><Badge variant={pago.metodo === "efectivo" ? "success" : "default"}>{pago.metodo === "efectivo" ? "Efectivo" : "Transferencia"}</Badge></td>
                    <td className="px-4 py-3 text-right"><span className="font-bold text-violet-400">${pago.monto.toLocaleString()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

