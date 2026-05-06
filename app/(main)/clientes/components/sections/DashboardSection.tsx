"use client";
import { useMemo } from "react";
import { Users, DollarSign, ShieldCheck, AlertTriangle, CheckCircle2, Layers, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { SocioConEstado } from "../../types/client";

interface PlanType { id: string; nombre: string; duracionDias: number; precio: number; _count?: { socios: number } }

function StatCard({ icon, label, value, sublabel, trend, iconBg, iconColor }: {
  icon: React.ReactNode; label: string; value: string | number; sublabel?: string;
  trend?: { value: number; positive: boolean }; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: iconBg, color: iconColor }}>{icon}</div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${trend.positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {trend.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)] mb-1">{value}</p>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      {sublabel && <p className="text-xs text-[var(--text-tertiary)] mt-1">{sublabel}</p>}
    </div>
  );
}

function Avatar({ nombre, apellido, tieneDeuda, size = "sm" }: { nombre: string; apellido: string; tieneDeuda: boolean; size?: "sm" | "md" }) {
  const initials = `${nombre[0]}${apellido[0]}`;
  const sizes = { sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-base" };
  return (
    <div className="relative">
      <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-white`}>
        {initials}
      </div>
      <div className={`absolute ${size === "sm" ? "w-2 h-2 -bottom-0.5 -right-0.5" : "w-3 h-3 -bottom-1 -right-1"} rounded-full border-2 border-[var(--bg-card)] ${tieneDeuda ? "bg-amber-500" : "bg-emerald-500"}`} />
    </div>
  );
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

interface DashboardSectionProps {
  socios: SocioConEstado[];
  pagos: any[];
  planes: PlanType[];
}

export function DashboardSection({ socios, pagos, planes }: DashboardSectionProps) {
  const stats = useMemo(() => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    const totalSocios = socios.length;
    const sociosAlDia = socios.filter((s) => !s.tieneDeuda).length;
    const sociosConDeuda = totalSocios - sociosAlDia;

    const ingresosMes = pagos.filter((p) => p.mes === mesActual && p.anio === anioActual).reduce((sum, p) => sum + p.monto, 0);
    const ingresosAnterior = pagos.filter((p) => (p.mes === (mesActual === 1 ? 12 : mesActual - 1)) && (p.anio === (mesActual === 1 ? anioActual - 1 : anioActual))).reduce((sum, p) => sum + p.monto, 0);

    const planCounts: Record<string, number> = {};
    socios.forEach((s) => { planCounts[s.plan.nombre] = (planCounts[s.plan.nombre] || 0) + 1; });
    const distribucionPlanes = Object.entries(planCounts).map(([nombre, count]) => ({ nombre, count, percentage: totalSocios > 0 ? Math.round((count / totalSocios) * 100) : 0 }));

    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return { value: 0, positive: true };
      const val = Math.round(((current - previous) / previous) * 100);
      return { value: Math.abs(val), positive: val >= 0 };
    };

    return { totalSocios, sociosAlDia, sociosConDeuda, ingresosMes, distribucionPlanes, trends: { ingresos: calcTrend(ingresosMes, ingresosAnterior), socios: { value: 0, positive: true } } };
  }, [socios, pagos]);

  const deudores = socios.filter((s) => s.tieneDeuda).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-[var(--text-secondary)]">Resumen de tu gimnasio</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Socios" value={stats.totalSocios} sublabel={`${planes.length} planes activos`} iconBg="rgba(124, 58, 237, 0.1)" iconColor="rgb(124, 58, 237)" />
        <StatCard icon={<ShieldCheck className="w-5 h-5" />} label="Al dia" value={stats.sociosAlDia} sublabel={`${stats.totalSocios > 0 ? Math.round((stats.sociosAlDia / stats.totalSocios) * 100) : 0}% del total`} iconBg="rgba(16, 185, 129, 0.1)" iconColor="rgb(16, 185, 129)" />
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Con deuda" value={stats.sociosConDeuda} sublabel="Requieren atencion" iconBg="rgba(245, 158, 11, 0.1)" iconColor="rgb(245, 158, 11)" trend={stats.sociosConDeuda > 0 ? { value: stats.sociosConDeuda, positive: false } : undefined} />
        <StatCard icon={<DollarSign className="w-5 h-5" />} label="Ingresos del mes" value={`$${stats.ingresosMes.toLocaleString()}`} sublabel={MESES[new Date().getMonth()]} iconBg="rgba(16, 185, 129, 0.1)" iconColor="rgb(16, 185, 129)" trend={stats.trends.ingresos} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <h3 className="font-semibold mb-4">Distribucion por Plan</h3>
          <div className="space-y-4">
            {stats.distribucionPlanes.length > 0 ? stats.distribucionPlanes.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between"><span className="text-sm font-medium">{item.nombre}</span><span className="text-sm text-[var(--text-secondary)]">{item.count} socios</span></div>
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full transition-all duration-700" style={{ width: `${item.percentage}%` }} /></div>
              </div>
            )) : <p className="text-center text-[var(--text-secondary)] py-8">Sin datos disponibles</p>}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Socios con Deuda</h3>{deudores.length > 0 && <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-medium">{deudores.length} pendientes</span>}</div>
          {deudores.length > 0 ? (
            <div className="space-y-3">{deudores.map((socio) => (
              <div key={socio.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]">
                <Avatar nombre={socio.nombre} apellido={socio.apellido} tieneDeuda={true} />
                <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{socio.nombre} {socio.apellido}</p><p className="text-xs text-[var(--text-secondary)]">{socio.plan.nombre}</p></div>
                <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium">Debe</span>
              </div>
            ))}</div>
          ) : (
            <div className="text-center py-8"><CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" /><p className="text-emerald-400 font-medium">Sin deudas!</p><p className="text-sm text-[var(--text-secondary)]">Todos los socios estan al dia</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
