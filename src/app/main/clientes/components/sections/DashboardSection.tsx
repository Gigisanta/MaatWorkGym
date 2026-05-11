'use client';
import { useMemo } from 'react';
import {
  Users,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { SocioConEstado } from '../../types/client';
import { cn } from '@/lib/utils';

interface PlanType {
  id: string;
  nombre: string;
  duracionDias: number;
  precio: number;
  _count?: { socios: number };
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  trend,
  iconClassName,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: { value: number; positive: boolean };
  iconClassName: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-xl p-5 border border-border/60 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            iconClassName
          )}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md",
              trend.positive
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            )}
          >
            {trend.positive ? <TrendingUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-semibold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {sublabel && (
          <p className="text-xs text-muted-foreground/70 mt-2">{sublabel}</p>
        )}
      </div>
    </motion.div>
  );
}

function Avatar({
  nombre,
  apellido,
  tieneDeuda,
}: {
  nombre: string;
  apellido: string;
  tieneDeuda: boolean;
}) {
  const initials = `${nombre[0] || ''}${apellido[0] || ''}`.toUpperCase();
  return (
    <div className="relative">
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-primary-foreground bg-gradient-to-br from-primary to-amber-400",
        )}
      >
        {initials}
      </div>
      <div
        className={cn(
          "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
          tieneDeuda ? 'bg-warning' : 'bg-success'
        )}
      />
    </div>
  );
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

interface PagoType {
  id: string;
  monto: number;
  mes: number;
  anio: number;
  socioId: string;
}

interface DashboardSectionProps {
  socios: SocioConEstado[];
  pagos: PagoType[];
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

    const ingresosMes = pagos
      .filter((p) => p.mes === mesActual && p.anio === anioActual)
      .reduce((sum, p) => sum + p.monto, 0);
    const ingresosAnterior = pagos
      .filter(
        (p) =>
          p.mes === (mesActual === 1 ? 12 : mesActual - 1) &&
          p.anio === (mesActual === 1 ? anioActual - 1 : anioActual),
      )
      .reduce((sum, p) => sum + p.monto, 0);

    const planCounts: Record<string, number> = {};
    socios.forEach((s) => {
      planCounts[s.plan.nombre] = (planCounts[s.plan.nombre] || 0) + 1;
    });
    const distribucionPlanes = Object.entries(planCounts).map(([nombre, count]) => ({
      nombre,
      count,
      percentage: totalSocios > 0 ? Math.round((count / totalSocios) * 100) : 0,
    }));

    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return { value: 0, positive: true };
      const val = Math.round(((current - previous) / previous) * 100);
      return { value: Math.abs(val), positive: val >= 0 };
    };

    return {
      totalSocios,
      sociosAlDia,
      sociosConDeuda,
      ingresosMes,
      distribucionPlanes,
      trends: {
        ingresos: calcTrend(ingresosMes, ingresosAnterior),
        socios: { value: 5, positive: true },
      },
    };
  }, [socios, pagos]);

  const deudores = socios.filter((s) => s.tieneDeuda).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          index={0}
          icon={<Users className="w-5 h-5 text-primary" />}
          label="Socios Activos"
          value={stats.totalSocios}
          sublabel={`${planes.length} planes`}
          iconClassName="bg-primary/10"
          trend={stats.trends.socios}
        />
        <StatCard
          index={1}
          icon={<ShieldCheck className="w-5 h-5 text-success" />}
          label="Al día"
          value={stats.sociosAlDia}
          sublabel={`${stats.totalSocios > 0 ? Math.round((stats.sociosAlDia / stats.totalSocios) * 100) : 0}% retención`}
          iconClassName="bg-success/10"
        />
        <StatCard
          index={2}
          icon={<AlertTriangle className="w-5 h-5 text-warning" />}
          label="Pendientes"
          value={stats.sociosConDeuda}
          sublabel="Requieren atención"
          iconClassName="bg-warning/10"
          trend={stats.sociosConDeuda > 0 ? { value: stats.sociosConDeuda, positive: false } : undefined}
        />
        <StatCard
          index={3}
          icon={<DollarSign className="w-5 h-5 text-success" />}
          label="Recaudación"
          value={`$${stats.ingresosMes.toLocaleString()}`}
          sublabel={`${MESES[new Date().getMonth()]}`}
          iconClassName="bg-success/10"
          trend={stats.trends.ingresos}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-card rounded-xl p-6 border border-border/60 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                Suscripciones por Plan
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Distribución mensual</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.distribucionPlanes.length > 0 ? (
              stats.distribucionPlanes.map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.nombre}</span>
                    <span className="text-sm font-semibold text-primary">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.count} suscriptores</span>
                </div>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 py-12 flex flex-col items-center justify-center text-muted-foreground/50 border border-dashed border-border rounded-xl">
                <Activity size={32} className="mb-3 opacity-50" />
                <p className="text-sm">Sin registros financieros</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl p-6 border border-border/60 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" />
              Morosidad
            </h3>
            {deudores.length > 0 && (
              <span className="px-2 py-1 rounded-md bg-warning/10 text-warning text-xs font-medium">
                {deudores.length} {deudores.length === 1 ? 'alerta' : 'alertas'}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {deudores.length > 0 ? (
              deudores.map((socio) => (
                <div
                  key={socio.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Avatar nombre={socio.nombre} apellido={socio.apellido} tieneDeuda={true} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {socio.nombre} {socio.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground">{socio.plan.nombre}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning">
                    <DollarSign size={14} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 text-success" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Cartera Limpia</p>
                <p className="text-xs text-muted-foreground">Todos los socios están al día.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
