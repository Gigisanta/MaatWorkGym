'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSocios } from '@/hooks/useSocios';
import { usePagos } from '@/hooks/usePagos';
import { useFichajes } from '@/hooks/useFichajes';
import {
  Users,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Activity,
  Loader2,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
} from 'lucide-react';
import { formatCurrencyARS } from '@/lib/design-system';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// ============================================================================
// Helpers
// ============================================================================

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const PLAN_COLORS = ['#7C6FCD', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];

// ============================================================================
// KPI Card
// ============================================================================

interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  trend?: { value: number; positive: boolean } | null;
  index: number;
}

function KpiCard({ label, value, sublabel, icon, iconBgClass, iconColorClass, trend, index }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgClass)}>
          <span className={iconColorClass}>{icon}</span>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md",
            trend.positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.value}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {sublabel && <p className="text-xs text-muted-foreground/70 mt-1">{sublabel}</p>}
    </motion.div>
  );
}

// ============================================================================
// Stat Card
// ============================================================================

function StatCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

// ============================================================================
// Chart tooltip
// ============================================================================

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' && p.name.toLowerCase().includes('ars') || p.name === 'Ingresos'
            ? formatCurrencyARS(p.value)
            : p.value}
        </p>
      ))}
    </div>
  );
};

// ============================================================================
// Main Page
// ============================================================================

export default function EstadisticasPage() {
  const { data: socios, isLoading: loadingSocios } = useSocios();
  const { data: pagos, isLoading: loadingPagos } = usePagos();
  const { data: fichajes, isLoading: loadingFichajes } = useFichajes();

  const stats = useMemo(() => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1; // 1-12
    const anioActual = hoy.getFullYear();

    const totalSocios = socios?.length || 0;
    const sociosAlDia = socios?.filter(s => !s.tieneDeuda).length || 0;
    const sociosConDeuda = totalSocios - sociosAlDia;

    // Ingresos del mes actual
    const ingresosMes = pagos
      ?.filter(p => p.mes === mesActual && p.anio === anioActual)
      .reduce((sum, p) => sum + p.monto, 0) || 0;

    // Ingresos del mes anterior para calcular tendencia
    const prevMonth = mesActual === 1 ? 12 : mesActual - 1;
    const prevYear = mesActual === 1 ? anioActual - 1 : anioActual;
    const ingresosAnterior = pagos
      ?.filter(p => p.mes === prevMonth && p.anio === prevYear)
      .reduce((sum, p) => sum + p.monto, 0) || 0;

    const trendIngresos = ingresosAnterior > 0
      ? Math.round(((ingresosMes - ingresosAnterior) / ingresosAnterior) * 100)
      : 0;

    // Visitas del mes (fichajes de socios)
    const visitasMes = fichajes?.filter(f => {
      const fecha = new Date(f.fechaHora);
      return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual;
    }).length || 0;

    // Visitas del mes anterior
    const visitasAnterior = fichajes?.filter(f => {
      const fecha = new Date(f.fechaHora);
      return fecha.getMonth() + 1 === prevMonth && fecha.getFullYear() === prevYear;
    }).length || 0;

    const trendVisitas = visitasAnterior > 0
      ? Math.round(((visitasMes - visitasAnterior) / visitasAnterior) * 100)
      : 0;

    // Plan distribution
    const planCounts: Record<string, number> = {};
    socios?.forEach(s => {
      const nombre = s.plan?.nombre || 'Sin plan';
      planCounts[nombre] = (planCounts[nombre] || 0) + 1;
    });
    const topPlanes = Object.entries(planCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    // Ingresos últimos 6 meses
    const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const ingresosHistorico: { mes: string; Ingresos: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      let m = mesActual - i;
      let y = anioActual;
      if (m <= 0) { m += 12; y -= 1; }
      const ing = pagos
        ?.filter(p => p.mes === m && p.anio === y)
        .reduce((sum, p) => sum + p.monto, 0) || 0;
      ingresosHistorico.push({ mes: mesesNombres[m - 1], Ingresos: ing });
    }

    // Fichajes últimos 7 días
    const diasNombres = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb'];
    const fichajesPorDia: { dia: string; Visitas: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const count = fichajes?.filter(f => {
        const fd = new Date(f.fechaHora);
        return fd.toDateString() === d.toDateString();
      }).length || 0;
      fichajesPorDia.push({ dia: diasNombres[d.getDay()], Visitas: count });
    }

    return {
      totalSocios,
      sociosAlDia,
      sociosConDeuda,
      ingresosMes,
      trendIngresos,
      visitasMes,
      trendVisitas,
      topPlanes,
      ingresosHistorico,
      fichajesPorDia,
    };
  }, [socios, pagos, fichajes]);

  if (loadingSocios || loadingPagos || loadingFichajes) {
    return (
      <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden h-full bg-background">
      {/* Header */}
      <header className="px-6 py-6 shrink-0 border-b border-border bg-background">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="text-primary" />
          Estadísticas
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen de rendimiento del gimnasio
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total Socios"
            value={stats.totalSocios}
            sublabel="Socios registrados"
            icon={<Users size={22} />}
            iconBgClass="bg-primary/10"
            iconColorClass="text-primary"
            index={0}
          />
          <KpiCard
            label="Al día"
            value={stats.sociosAlDia}
            sublabel={`${stats.totalSocios > 0 ? Math.round((stats.sociosAlDia / stats.totalSocios) * 100) : 0}% del total`}
            icon={<ShieldCheck size={22} />}
            iconBgClass="bg-success/10"
            iconColorClass="text-success"
            index={1}
          />
          <KpiCard
            label="Pendientes"
            value={stats.sociosConDeuda}
            sublabel="Requieren atención"
            icon={<AlertTriangle size={22} />}
            iconBgClass="bg-destructive/10"
            iconColorClass="text-destructive"
            index={2}
          />
          <KpiCard
            label="Ingresos del Mes"
            value={formatCurrencyARS(stats.ingresosMes)}
            sublabel="Este mes"
            icon={<DollarSign size={22} />}
            iconBgClass="bg-amber-500/10"
            iconColorClass="text-amber-500"
            trend={stats.trendIngresos !== 0 ? { value: Math.abs(stats.trendIngresos), positive: stats.trendIngresos >= 0 } : null}
            index={3}
          />
        </div>

        {/* Second Row: Trends */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KpiCard
            label="Visitas del Mes"
            value={stats.visitasMes}
            sublabel="Entradas registradas"
            icon={<Activity size={22} />}
            iconBgClass="bg-blue-500/10"
            iconColorClass="text-blue-500"
            trend={stats.trendVisitas !== 0 ? { value: Math.abs(stats.trendVisitas), positive: stats.trendVisitas >= 0 } : null}
            index={4}
          />
          <KpiCard
            label="Ingresos vs Mes Anterior"
            value={formatCurrencyARS(stats.ingresosMes - (pagos?.filter(p => {
              const prevMonth = new Date().getMonth() + 1 === 1 ? 12 : new Date().getMonth();
              const prevYear = new Date().getMonth() + 1 === 1 ? new Date().getFullYear() - 1 : new Date().getFullYear();
              return p.mes === prevMonth && p.anio === prevYear;
            }).reduce((s, p) => s + p.monto, 0) || 0))}
            sublabel="Diferencia mes a mes"
            icon={<TrendingUp size={22} />}
            iconBgClass="bg-purple-500/10"
            iconColorClass="text-purple-500"
            index={5}
          />
          <KpiCard
            label="Socios Activos"
            value={stats.sociosAlDia}
            sublabel={`${stats.totalSocios > 0 ? Math.round((stats.sociosAlDia / stats.totalSocios) * 100) : 0}% retención`}
            icon={<ShieldCheck size={22} />}
            iconBgClass="bg-emerald-500/10"
            iconColorClass="text-emerald-500"
            index={6}
          />
        </div>

        {/* Third Row: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ingresos Histórico */}
          <div className="lg:col-span-2">
            <StatCard title="Ingresos — Últimos 6 meses">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.ingresosHistorico} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="mes"
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => formatCurrencyARS(v).replace('$', '').split(',')[0] + 'k'}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Ingresos" fill="#7C6FCD" radius={[6, 6, 0, 0]} name="Ingresos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </StatCard>
          </div>

          {/* Plan Distribution Pie */}
          <div>
            <StatCard title="Socios por Plan">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={stats.topPlanes}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stats.topPlanes.map((_, i) => (
                        <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-xs text-muted-foreground">{value}</span>
                      )}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </StatCard>
          </div>
        </div>

        {/* Fourth Row: Fichajes por día */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatCard title="Visitas — Últimos 7 días">
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.fichajesPorDia} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="dia"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Visitas" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Visitas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </StatCard>

          {/* Planes más Populares */}
          <StatCard title="Planes más Populares">
            <div className="space-y-3">
              {stats.topPlanes.length > 0 ? (
                stats.topPlanes.slice(0, 5).map((plan, i) => (
                  <div key={plan.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: PLAN_COLORS[i % PLAN_COLORS.length] }}
                      />
                      <span className="text-sm text-foreground">{plan.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">{plan.value}</span>
                      <span className="text-xs text-muted-foreground">
                        ({stats.totalSocios > 0 ? Math.round((plan.value / stats.totalSocios) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sin datos aún</p>
              )}
            </div>
          </StatCard>
        </div>
      </div>
    </div>
  );
}
