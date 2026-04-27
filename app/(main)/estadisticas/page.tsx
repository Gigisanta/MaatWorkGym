"use client";

import { useMemo } from "react";
import { useSocios } from "@/hooks/useSocios";
import { usePagos } from "@/hooks/usePagos";
import { useFichajes } from "@/hooks/useFichajes";
import { usePlanes } from "@/hooks/usePlanes";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Flame,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

// ---------------------------------------------------------------------------
// StatCard Component
// ---------------------------------------------------------------------------
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div
      className="
        flex flex-col justify-between
        p-6 rounded-2xl min-h-[140px]
        bg-[var(--bg-card)] border border-[var(--border)]
        transition-all duration-300
        hover:border-[var(--accent)] hover:shadow-lg
        animate-in fade-in slide-in-from-bottom-2 duration-500
      "
    >
      <div className="flex items-start justify-between">
        <div
          className="
            w-12 h-12 rounded-xl flex items-center justify-center
            bg-[var(--accent)]/10 text-[var(--accent)]
          "
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`
              flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full
              ${trend.positive
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400"
              }
            `}
          >
            {trend.positive
              ? <ArrowUpRight className="w-3 h-3" />
              : <ArrowDownRight className="w-3 h-3" />
            }
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p
          className="
            text-sm font-medium mb-2
            [color:var(--text-secondary)]
          "
        >
          {label}
        </p>
        <p
          className="
            text-4xl font-extrabold leading-none
            [font-family:'Plus_Jakarta_Sans',sans-serif]
          "
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RevenueChart Component
// ---------------------------------------------------------------------------
interface RevenueChartProps {
  data: { mes: string; total: number }[];
  maxValue: number;
}

function RevenueChart({ data, maxValue }: RevenueChartProps) {
  return (
    <div className="h-52 flex items-end justify-between gap-2 px-2">
      {data.map((item, i) => {
        const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full relative group">
              <div
                className="
                  w-full rounded-t-lg
                  bg-gradient-to-t from-[var(--accent)] to-[var(--accent)]/60
                  transition-all duration-500 ease-out
                "
                style={{ height: `${Math.max(height, 4)}%` }}
              />
              <div
                className="
                  absolute -top-8 left-1/2 -translate-x-1/2
                  bg-[var(--bg-card)] border border-[var(--border)]
                  text-xs px-2 py-1 rounded-lg
                  opacity-0 group-hover:opacity-100 transition-opacity
                  whitespace-nowrap font-medium shadow-lg
                  [color:var(--text-primary)]
                "
              >
                ${item.total.toLocaleString()}
              </div>
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {item.mes}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PlanDistribution Component
// ---------------------------------------------------------------------------
interface PlanDistItem {
  nombre: string;
  count: number;
  percentage: number;
}

const PLAN_COLORS = [
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
] as const;

function PlanDistribution({ data }: { data: PlanDistItem[] }) {
  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{item.nombre}</span>
            <div className="flex items-center gap-2">
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.count}
              </span>
              <span
                className={`
                  text-xs font-bold px-2 py-0.5 rounded-full
                  ${PLAN_COLORS[i % PLAN_COLORS.length]}/15 ${PLAN_COLORS[i % PLAN_COLORS.length].replace("bg-", "text-")}
                `}
              >
                {item.percentage}%
              </span>
            </div>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${PLAN_COLORS[i % PLAN_COLORS.length]}`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TopSociosRanking Component
// ---------------------------------------------------------------------------
interface TopSocioItem {
  nombre: string;
  count: number;
}

function TopSociosRanking({ data }: { data: TopSocioItem[] }) {
  const medals = ["🥇", "🥈", "🥉"];

  if (data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <Users className="w-12 h-12 opacity-50" />
        <p>Sin datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((socio, i) => (
        <div
          key={i}
          className="
            flex items-center gap-4 p-4 rounded-xl
            border transition-all duration-200
            hover:scale-[1.01]
            [bg-[var(--bg-card)] border-[var(--border)]]
            hover:border-[var(--accent)]/30
          "
        >
          <div
            className="
              w-10 h-10 rounded-xl flex items-center justify-center
              text-lg font-bold
              bg-[var(--bg-secondary)]
            "
          >
            {i < 3 ? medals[i] : `#${i + 1}`}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{socio.nombre}</p>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="w-3 h-3 text-orange-400" />
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {socio.count} visitas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(socio.count, 5) }).map((_, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DebtorsList Component
// ---------------------------------------------------------------------------
interface DebtorItem {
  id: string;
  nombre: string;
  apellido: string;
  plan: { nombre: string };
  tieneDeuda: boolean;
}

function DebtorsList({ data }: { data: DebtorItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <CheckCircle2 className="w-12 h-12 text-emerald-400 opacity-60" />
        <p className="font-medium text-emerald-400">Sin deudas</p>
        <p className="text-sm">Todos los socios están al día</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((socio) => (
        <div
          key={socio.id}
          className="
            flex items-center gap-4 p-4 rounded-xl
            border border-red-500/20
            bg-[var(--bg-card)]
            transition-all duration-200
            hover:border-red-500/40
          "
        >
          <div
            className="
              w-12 h-12 rounded-xl flex items-center justify-center
              text-lg font-bold
              bg-red-500/15 text-red-400
              border border-red-500/20
            "
          >
            {socio.nombre[0]}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold">
              {socio.nombre} {socio.apellido}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                {socio.plan.nombre}
              </span>
            </div>
          </div>

          <span
            className="
              text-xs font-bold px-3 py-1 rounded-full
              bg-red-500/15 text-red-400
            "
          >
            PENDIENTE
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export default function EstadisticasPage() {
  const { data: socios } = useSocios();
  const { data: pagos } = usePagos();
  const { data: fichajes } = useFichajes(false);
  const { data: planes } = usePlanes();

  const stats = useMemo(() => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();
    const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
    const anioAnterior = mesActual === 1 ? anioActual - 1 : anioActual;

    if (!socios || !pagos) {
      return {
        totalSocios: 0,
        sociosAlDia: 0,
        sociosConDeuda: 0,
        ingresosMes: 0,
        fichajesMes: 0,
        evolucionIngresos: [] as { mes: string; total: number }[],
        distribucionPlanes: [] as PlanDistItem[],
        topSocios: [] as TopSocioItem[],
        trends: { socios: 0, ingresos: 0, fichajes: 0 },
      };
    }

    const totalSocios = socios.length;
    const sociosAlDia = socios.filter((s) => !s.tieneDeuda).length;
    const sociosConDeuda = totalSocios - sociosAlDia;

    const ingresosMes = pagos
      .filter((p) => p.mes === mesActual && p.anio === anioActual)
      .reduce((sum, p) => sum + p.monto, 0);

    const ingresosMesAnterior = pagos
      .filter((p) => p.mes === mesAnterior && p.anio === anioAnterior)
      .reduce((sum, p) => sum + p.monto, 0);

    const fichajesMes = fichajes
      ? fichajes.filter((f) => {
          const fMes = new Date(f.fechaHora).getMonth() + 1;
          const fAnio = new Date(f.fechaHora).getFullYear();
          return fMes === mesActual && fAnio === anioActual;
        }).length
      : 0;

    const fichajesMesAnterior = fichajes
      ? fichajes.filter((f) => {
          const fFecha = new Date(f.fechaHora);
          const fMes = fFecha.getMonth() + 1;
          const fAnio = fFecha.getFullYear();
          return fMes === mesAnterior && fAnio === anioAnterior;
        }).length
      : 0;

    const evolucionIngresos = MESES.slice(0, mesActual).map((mes, i) => {
      const mesNum = i + 1;
      const total = pagos
        .filter((p) => p.mes === mesNum && p.anio === anioActual)
        .reduce((sum, p) => sum + p.monto, 0);
      return { mes, total };
    });

    const planCounts: Record<string, number> = {};
    socios.forEach((s) => {
      const planNombre = s.plan.nombre;
      planCounts[planNombre] = (planCounts[planNombre] || 0) + 1;
    });

    const distribucionPlanes = Object.entries(planCounts).map(([nombre, count]) => ({
      nombre,
      count,
      percentage: Math.round((count / totalSocios) * 100),
    }));

    const socioFichajes: Record<string, number> = {};
    fichajes?.forEach((f) => {
      const nombre = `${f.socio.nombre} ${f.socio.apellido}`;
      socioFichajes[nombre] = (socioFichajes[nombre] || 0) + 1;
    });

    const topSocios = Object.entries(socioFichajes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, count]) => ({ nombre, count }));

    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      totalSocios,
      sociosAlDia,
      sociosConDeuda,
      ingresosMes,
      fichajesMes,
      evolucionIngresos,
      distribucionPlanes,
      topSocios,
      trends: {
        socios: calcTrend(totalSocios, totalSocios - (sociosConDeuda > 0 ? 1 : 0)),
        ingresos: calcTrend(ingresosMes, ingresosMesAnterior),
        fichajes: calcTrend(fichajesMes, fichajesMesAnterior),
      },
    };
  }, [socios, pagos, fichajes]);

  const maxIngreso = Math.max(...stats.evolucionIngresos.map((e) => e.total), 1);
  const currentMonth = new Date().toLocaleString("es-ES", { month: "long" });

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="
              w-10 h-10 rounded-xl flex items-center justify-center
              [background:var(--accent)]
            "
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Estadísticas</h1>
        </div>
        <p
          className="ml-13 capitalize text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {currentMonth} {new Date().getFullYear()}
        </p>
      </div>

      {/* Stats Grid - 3 columns */}
      <div
        className="
          grid gap-4 mb-6
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        "
      >
        <StatCard
          label="Total Socios"
          value={stats.totalSocios}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="Al día"
          value={stats.sociosAlDia}
          icon={<ShieldCheck className="w-5 h-5" />}
        />
        <StatCard
          label="Con deuda"
          value={stats.sociosConDeuda}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <StatCard
          label="Ingresos del mes"
          value={`$${stats.ingresosMes.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: Math.abs(stats.trends.ingresos), positive: stats.trends.ingresos >= 0 }}
        />
        <StatCard
          label="Fichajes este mes"
          value={stats.fichajesMes}
          icon={<Calendar className="w-5 h-5" />}
          trend={{ value: Math.abs(stats.trends.fichajes), positive: stats.trends.fichajes >= 0 }}
        />
        <StatCard
          label="Planes activos"
          value={planes?.length ?? 0}
          icon={<Trophy className="w-5 h-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-6">
        {/* Revenue Chart */}
        <div
          className="
            lg:col-span-2 rounded-2xl p-6
            border [border-color:var(--border)]
            bg-[var(--bg-card)]
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="
                  w-10 h-10 rounded-xl flex items-center justify-center
                  bg-emerald-500/15 text-emerald-400
                "
              >
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Evolución de Ingresos</h3>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Últimos {stats.evolucionIngresos.length} meses
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className="
                  text-2xl font-bold
                  [font-family:'Plus_Jakarta_Sans',sans-serif]
                "
                style={{ color: "var(--text-primary)" }}
              >
                ${stats.ingresosMes.toLocaleString()}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                este mes
              </p>
            </div>
          </div>
          <RevenueChart data={stats.evolucionIngresos} maxValue={maxIngreso} />
        </div>

        {/* Plan Distribution */}
        <div
          className="
            rounded-2xl p-6
            border [border-color:var(--border)]
            bg-[var(--bg-card)]
          "
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="
                w-10 h-10 rounded-xl flex items-center justify-center
                bg-amber-500/15 text-amber-400
              "
            >
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Planes</h3>
              <p
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Distribución
              </p>
            </div>
          </div>
          <PlanDistribution data={stats.distribucionPlanes} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Top 5 Socios */}
        <div
          className="
            rounded-2xl p-6
            border [border-color:var(--border)]
            bg-[var(--bg-card)]
          "
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="
                w-10 h-10 rounded-xl flex items-center justify-center
                bg-orange-500/15 text-orange-400
              "
            >
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Top 5 Socios</h3>
              <p
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Más asiduos del mes
              </p>
            </div>
          </div>
          <TopSociosRanking data={stats.topSocios} />
        </div>

        {/* Debtors */}
        <div
          className="
            rounded-2xl p-6
            border [border-color:var(--border)]
            bg-[var(--bg-card)]
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="
                  w-10 h-10 rounded-xl flex items-center justify-center
                  bg-red-500/15 text-red-400
                "
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Socios con Deuda</h3>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {stats.sociosConDeuda > 0
                    ? `${stats.sociosConDeuda} pendiente${stats.sociosConDeuda > 1 ? "s" : ""}`
                    : "Sin deudas"
                  }
                </p>
              </div>
            </div>
            {stats.sociosConDeuda > 0 && (
              <div
                className="
                  w-10 h-10 rounded-xl flex items-center justify-center
                  bg-red-500/20
                "
              >
                <span className="text-lg font-bold text-red-400">
                  {stats.sociosConDeuda}
                </span>
              </div>
            )}
          </div>
          <DebtorsList data={socios?.filter((s) => s.tieneDeuda).slice(0, 5) || []} />
        </div>
      </div>
    </div>
  );
}
