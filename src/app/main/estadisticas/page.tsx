'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSocios } from '@/hooks/useSocios';
import { usePagos } from '@/hooks/usePagos';
import { useFichajes } from '@/hooks/useFichajes';
import { Users, DollarSign, ShieldCheck, AlertTriangle, TrendingUp, Activity, Loader2 } from 'lucide-react';
import { formatCurrencyARS } from '@/lib/design-system';

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
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgClass)}>
          <span className={iconColorClass}>{icon}</span>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md",
            trend.positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          )}>
            <TrendingUp size={12} />
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-base font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function EstadisticasPage() {
  const { data: socios, isLoading: loadingSocios } = useSocios();
  const { data: pagos, isLoading: loadingPagos } = usePagos();
  const { data: fichajes, isLoading: loadingFichajes } = useFichajes();

  const stats = useMemo(() => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    const totalSocios = socios?.length || 0;
    const sociosAlDia = socios?.filter(s => !s.tieneDeuda).length || 0;
    const sociosConDeuda = totalSocios - sociosAlDia;

    const ingresosMes = pagos
      ?.filter(p => p.mes === mesActual && p.anio === anioActual)
      .reduce((sum, p) => sum + p.monto, 0) || 0;

    const ingresosAnterior = pagos
      ?.filter(p => {
        const prevMonth = mesActual === 1 ? 12 : mesActual - 1;
        const prevYear = mesActual === 1 ? anioActual - 1 : anioActual;
        return p.mes === prevMonth && p.anio === prevYear;
      })
      .reduce((sum, p) => sum + p.monto, 0) || 0;

    const trendIngresos = ingresosAnterior > 0
      ? Math.round(((ingresosMes - ingresosAnterior) / ingresosAnterior) * 100)
      : 0;

    const visitasMes = fichajes?.filter(f => {
      const fecha = new Date(f.fechaHora);
      return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual;
    }).length || 0;

    const planCounts: Record<string, number> = {};
    socios?.forEach(s => {
      planCounts[s.plan.nombre] = (planCounts[s.plan.nombre] || 0) + 1;
    });
    const topPlanes = Object.entries(planCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalSocios,
      sociosAlDia,
      sociosConDeuda,
      ingresosMes,
      trendIngresos,
      visitasMes,
      topPlanes,
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
        <p className="text-sm text-muted-foreground mt-1">Resumen del rendimiento del gimnasio</p>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            iconBgClass="bg-warning/10"
            iconColorClass="text-warning"
            trend={stats.trendIngresos !== 0 ? { value: Math.abs(stats.trendIngresos), positive: stats.trendIngresos >= 0 } : null}
            index={3}
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Visitas este Mes">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Activity size={28} className="text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.visitasMes}</p>
                <p className="text-sm text-muted-foreground">Entradas registradas</p>
              </div>
            </div>
          </StatCard>

          <StatCard title="Planes más Populares">
            <div className="space-y-3">
              {stats.topPlanes.length > 0 ? (
                stats.topPlanes.map(([nombre, count], i) => (
                  <div key={nombre} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{nombre}</span>
                    <span className="text-sm font-semibold text-primary">{count}</span>
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
