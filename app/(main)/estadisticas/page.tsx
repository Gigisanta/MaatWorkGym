"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSocios } from "@/hooks/useSocios";
import { usePagos } from "@/hooks/usePagos";
import { useFichajes } from "@/hooks/useFichajes";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Medal,
  ShieldCheck,
  CheckCircle2,
  Award,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  spacing,
  borderRadius,
  grid,
  animation,
  chartConfig,
  planColors,
  medalColors,
  getAvatarColor,
  getInitials,
  cardStyle,
  cardHoverStyle,
  textStyle,
  badgeStyle,
  tagStyle,
  formatCurrencyARS,
  formatMonth,
} from "@/lib/design-system";

// ---------------------------------------------------------------------------
// CountUp Hook
// ---------------------------------------------------------------------------
function useCountUp(target: number, duration = 1400): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}

// ---------------------------------------------------------------------------
// Animation Variants
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: animation.easing },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: animation.easing },
  },
};

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: animation.staggerList } },
};

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------
interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: { value: number; positive: boolean } | null;
  statusBadge?: string | null;
  statusType?: "success" | "danger" | null;
  index: number;
}

function KpiCard({
  label,
  value,
  prefix = "",
  icon,
  iconBg,
  iconColor,
  trend,
  statusBadge,
  statusType,
  index,
}: KpiCardProps) {
  const count = useCountUp(value);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: index * animation.staggerKpi }}
    >
      <Card
        className="group cursor-default flex flex-col"
        style={{
          ...cardStyle(),
          padding: `${spacing[5]}px`,
          minHeight: 148,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          Object.assign(el.style, cardHoverStyle());
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = colors.border;
          el.style.transform = "";
          el.style.boxShadow = "none";
        }}
      >
        {/* Top row: icon + status badge */}
        <div className="flex items-start justify-between mb-auto">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg, color: iconColor }}
          >
            {icon}
          </div>
          {statusBadge && (
            <div
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                ...badgeStyle(statusType ?? "neutral"),
                fontFamily: fontFamily.dmSans,
              }}
            >
              {statusBadge}
            </div>
          )}
        </div>

        {/* Center: KPI value + label, centered */}
        <div className="flex flex-col items-center justify-center flex-1 py-2">
          <p className="leading-none mb-1" style={textStyle("kpi")}>
            {prefix}
            {count.toLocaleString("es-AR")}
          </p>
          <p style={textStyle("label")}>{label}</p>
        </div>

        {/* Bottom: trend badge */}
        {trend && (
          <div className="flex items-center justify-end mt-auto">
            <div
              className="flex items-center gap-0.5 text-xs font-semibold"
              style={{
                background: trend.positive ? colors.successBg : colors.dangerBg,
                color: trend.positive ? colors.success : colors.danger,
                padding: "3px 8px",
                borderRadius: borderRadius.full,
                fontFamily: fontFamily.dmSans,
              }}
            >
              {trend.positive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(trend.value)}%
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Income Chart
// ---------------------------------------------------------------------------
interface ChartDataPoint {
  mes: string;
  total: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: chartConfig.tooltipBg,
        border: `1px solid ${chartConfig.tooltipBorder}`,
        borderRadius: chartConfig.tooltipRadius,
        padding: `${spacing[3]}px ${spacing[4]}px`,
        fontFamily: fontFamily.dmSans,
        fontSize: fontSize.sm,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ color: colors.textSecondary, marginBottom: spacing[1], fontSize: fontSize.xs }}>
        {label}
      </p>
      <p style={{ color: colors.accent, fontWeight: fontWeight.bold, fontSize: fontSize.md }}>
        {formatCurrencyARS(payload[0].value)}
      </p>
    </div>
  );
}

function IncomeAreaChart({ data }: { data: ChartDataPoint[] }) {
  const hasData = data.some((d) => d.total > 0);

  if (!hasData) {
    return (
      <div
        className="flex flex-col items-center justify-center h-52 gap-2"
        style={{ color: colors.textSecondary }}
      >
        <TrendingUp className="w-8 h-8 opacity-30" />
        <p style={{ fontSize: fontSize.sm, fontFamily: fontFamily.dmSans }}>
          Sin datos de ingresos
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: spacing[1], right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={chartConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartConfig.gradientFrom} />
            <stop offset="95%" stopColor={chartConfig.gradientTo} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="0"
          stroke={chartConfig.cartesianGridStroke}
          horizontal={true}
          vertical={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "rgba(124,111,205,0.2)", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke={chartConfig.lineColor}
          strokeWidth={chartConfig.lineWidth}
          fill={`url(#${chartConfig.gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: chartConfig.lineColor, strokeWidth: 0 }}
          animationDuration={1000}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Plan Distribution
// ---------------------------------------------------------------------------
interface PlanDistItem {
  nombre: string;
  count: number;
  percentage: number;
}

function PlanDistributionPanel({ data }: { data: PlanDistItem[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {data.slice(0, 3).map((item, i) => {
        const color = planColors[item.nombre] ?? colors.accent;
        return (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: color }}
                />
                <span
                  style={{
                    fontFamily: fontFamily.dmSans,
                    fontSize: fontSize.md,
                    color: colors.textPrimary,
                    fontWeight: fontWeight.medium,
                  }}
                >
                  {item.nombre}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontFamily: fontFamily.dmSans,
                    fontSize: fontSize.sm,
                    color: colors.textSecondary,
                  }}
                >
                  {item.count} socios
                </span>
                <span
                  style={{
                    fontFamily: fontFamily.syne,
                    fontSize: fontSize.md,
                    fontWeight: fontWeight.bold,
                    color,
                    minWidth: 36,
                    textAlign: "right",
                  }}
                >
                  {item.percentage}%
                </span>
              </div>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                style={{
                  background: color,
                  height: "100%",
                  borderRadius: 3,
                  width: mounted ? `${item.percentage}%` : "0%",
                  transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top Socios List
// ---------------------------------------------------------------------------
interface TopSocioItem {
  nombre: string;
  count: number;
}

function TopSociosList({ data }: { data: TopSocioItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 gap-2"
        style={{ color: colors.textSecondary }}
      >
        <Users className="w-8 h-8 opacity-30" />
        <p style={{ fontSize: fontSize.sm, fontFamily: fontFamily.dmSans }}>
          Sin datos disponibles
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerStagger}
      initial="hidden"
      animate="show"
      className="flex flex-col"
    >
      {data.map((socio, i) => {
        const { bg, accent } = getAvatarColor(socio.nombre);
        const initials = getInitials(socio.nombre);
        const medalColor = medalColors[i] ?? colors.textSecondary;

        return (
          <motion.div
            key={i}
            variants={fadeInLeft}
            className="flex items-center gap-3 py-3 rounded-lg px-2 -mx-2 cursor-default"
            style={{
              borderBottom:
                i < data.length - 1
                  ? `1px solid ${colors.borderSubtle}`
                  : "none",
              transition: `background ${animation.normal} ease`,
            }}
            whileHover={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
              {i < 3 ? (
                <Medal className="w-5 h-5" style={{ color: medalColor }} />
              ) : (
                <span
                  style={{
                    fontFamily: fontFamily.syne,
                    fontSize: fontSize.sm,
                    fontWeight: fontWeight.bold,
                    color: colors.textSecondary,
                  }}
                >
                  #{i + 1}
                </span>
              )}
            </div>

            <Avatar size="sm" className="flex-shrink-0">
              <AvatarFallback
                style={{
                  background: bg,
                  color: accent,
                  fontSize: fontSize.xs,
                  fontWeight: fontWeight.bold,
                  fontFamily: fontFamily.dmSans,
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p
                className="text-sm truncate"
                style={{
                  fontFamily: fontFamily.dmSans,
                  fontWeight: fontWeight.medium,
                  color: colors.textPrimary,
                }}
              >
                {socio.nombre}
              </p>
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3" style={{ color: colors.amber }} />
                <span
                  style={{
                    fontSize: fontSize.xs,
                    fontFamily: fontFamily.dmSans,
                    color: colors.textSecondary,
                  }}
                >
                  {socio.count} visitas
                </span>
              </div>
            </div>

            <span
              style={{
                fontSize: fontSize.xs,
                fontFamily: fontFamily.syne,
                fontWeight: fontWeight.bold,
                color: colors.textSecondary,
              }}
            >
              #{i + 1}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Debtors Panel
// ---------------------------------------------------------------------------
interface DebtorItem {
  id: string;
  nombre: string;
  apellido: string;
  plan: { nombre: string };
}

function DebtorsPanel({ data }: { data: DebtorItem[] }) {
  if (data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-8 gap-2 rounded-xl"
        style={tagStyle.success}
      >
        <CheckCircle2 className="w-7 h-7" style={{ color: colors.success }} />
        <p
          style={{
            fontSize: fontSize.md,
            fontWeight: fontWeight.semibold,
            color: colors.success,
            fontFamily: fontFamily.dmSans,
          }}
        >
          Sin más deudas este mes
        </p>
        <p
          style={{
            fontSize: fontSize.xs,
            fontFamily: fontFamily.dmSans,
            color: colors.textSecondary,
          }}
        >
          Todos los socios están al día
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerStagger}
      initial="hidden"
      animate="show"
      className="flex flex-col"
    >
      {data.map((socio) => (
        <motion.div
          key={socio.id}
          variants={fadeInLeft}
          className="flex items-center gap-3 py-3 rounded-lg px-2 -mx-2 cursor-default"
          style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}
          whileHover={{ background: "rgba(232,81,74,0.04)" }}
        >
          <Avatar size="sm" className="flex-shrink-0">
            <AvatarFallback
              style={{
                background: colors.dangerBg,
                color: colors.danger,
                fontSize: fontSize.xs,
                fontWeight: fontWeight.bold,
                fontFamily: fontFamily.dmSans,
              }}
            >
              {socio.nombre[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p
              className="text-sm truncate"
              style={{
                fontFamily: fontFamily.dmSans,
                fontWeight: fontWeight.medium,
                color: colors.textPrimary,
              }}
            >
              {socio.nombre} {socio.apellido}
            </p>
            <span
              style={{
                fontSize: fontSize.xs,
                fontFamily: fontFamily.dmSans,
                color: colors.textSecondary,
              }}
            >
              {socio.plan.nombre}
            </span>
          </div>

          <div style={tagStyle.pendiente}>Pendiente</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function EstadisticasPage() {
  const { data: socios } = useSocios();
  const { data: pagos } = usePagos();
  const { data: fichajes } = useFichajes(false);

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
        evolucionIngresos: [] as ChartDataPoint[],
        distribucionPlanes: [] as PlanDistItem[],
        topSocios: [] as TopSocioItem[],
        trends: { ingresos: 0 as number },
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

    const evolucionIngresos: ChartDataPoint[] = [3, 2, 1, 0].map((offset) => {
      let m = mesActual - offset;
      let y = anioActual;
      if (m <= 0) {
        m += 12;
        y -= 1;
      }
      const mesName = new Date(y, m - 1, 1).toLocaleString("es-ES", {
        month: "short",
      });
      const total = pagos
        .filter((p) => p.mes === m && p.anio === y)
        .reduce((sum, p) => sum + p.monto, 0);
      return {
        mes: mesName.charAt(0).toUpperCase() + mesName.slice(1),
        total,
      };
    });

    const planCounts: Record<string, number> = {};
    socios.forEach((s) => {
      planCounts[s.plan.nombre] = (planCounts[s.plan.nombre] || 0) + 1;
    });

    const distribucionPlanes: PlanDistItem[] = Object.entries(planCounts).map(
      ([nombre, count]) => ({
        nombre,
        count,
        percentage:
          totalSocios > 0
            ? Math.round((count / totalSocios) * 100)
            : 0,
      })
    );

    const socioFichajes: Record<string, number> = {};
    fichajes?.forEach((f) => {
      const nombre = `${f.socio.nombre} ${f.socio.apellido}`;
      socioFichajes[nombre] = (socioFichajes[nombre] || 0) + 1;
    });

    const topSocios: TopSocioItem[] = Object.entries(socioFichajes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, count]) => ({ nombre, count }));

    const calcTrend = (current: number, previous: number): number => {
      if (previous === 0) return 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      totalSocios,
      sociosAlDia,
      sociosConDeuda,
      ingresosMes,
      evolucionIngresos,
      distribucionPlanes,
      topSocios,
      trends: {
        ingresos: calcTrend(ingresosMes, ingresosMesAnterior),
      },
    };
  }, [socios, pagos, fichajes]);

  const currentMonth = formatMonth(new Date());

  return (
    <div
      className="page-container"
      style={{ padding: spacing[7], background: colors.bgBase, minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <h1 style={textStyle("heading")}>Estadísticas</h1>
        <p
          style={{
            ...textStyle("subheading"),
            textTransform: "capitalize",
          }}
        >
          {currentMonth} {new Date().getFullYear()}
        </p>
      </div>

      {/* FILA 1 — KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: grid.kpiColumns,
          gap: grid.gap,
          marginBottom: grid.gap,
        }}
      >
        <KpiCard
          label="Total Socios"
          value={stats.totalSocios}
          icon={<Users className="w-4 h-4" />}
          iconBg={colors.accentBg}
          iconColor={colors.accent}
          index={0}
        />
        <KpiCard
          label="Al día"
          value={stats.sociosAlDia}
          icon={<ShieldCheck className="w-4 h-4" />}
          iconBg={colors.successBg}
          iconColor={colors.success}
          statusBadge="Al día"
          statusType="success"
          index={1}
        />
        <KpiCard
          label="Con deuda"
          value={stats.sociosConDeuda}
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBg={colors.dangerBg}
          iconColor={colors.danger}
          statusBadge={
            stats.sociosConDeuda > 0 ? `+${stats.sociosConDeuda}` : undefined
          }
          statusType={stats.sociosConDeuda > 0 ? "danger" : undefined}
          index={2}
        />
        <KpiCard
          label="Ingresos del mes"
          value={stats.ingresosMes}
          prefix="$"
          icon={<DollarSign className="w-4 h-4" />}
          iconBg={colors.amberBg}
          iconColor={colors.amber}
          trend={
            stats.trends.ingresos !== 0
              ? {
                  value: Math.abs(stats.trends.ingresos),
                  positive: stats.trends.ingresos >= 0,
                }
              : null
          }
          index={3}
        />
      </div>

      {/* FILA 2 — Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: grid.chartColumns,
          gap: grid.gap,
          marginBottom: grid.gap,
        }}
      >
        {/* Income Chart */}
        <Card
          className="p-5"
          style={cardStyle()}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ ...textStyle("body"), fontWeight: fontWeight.semibold }}>
                Evolución de Ingresos
              </h3>
              <p style={{ ...textStyle("caption"), marginTop: 2 }}>
                Últimos 4 meses
              </p>
            </div>
            <div className="text-right">
              <p
                style={{
                  fontFamily: fontFamily.syne,
                  fontSize: fontSize["2xl"],
                  fontWeight: fontWeight.extrabold,
                  color: colors.textPrimary,
                  letterSpacing: "-0.03em",
                }}
              >
                {formatCurrencyARS(stats.ingresosMes)}
              </p>
              <p
                style={{
                  ...textStyle("caption"),
                  textTransform: "capitalize",
                }}
              >
                {currentMonth}
              </p>
            </div>
          </div>
          <IncomeAreaChart data={stats.evolucionIngresos} />
        </Card>

        {/* Plan Distribution */}
        <Card
          className="p-5"
          style={cardStyle()}
        >
          <div className="mb-5">
            <h3 style={{ ...textStyle("body"), fontWeight: fontWeight.semibold }}>
              Distribución de Planes
            </h3>
            <p style={{ ...textStyle("caption"), marginTop: 2 }}>
              Membresías activas
            </p>
          </div>
          <PlanDistributionPanel data={stats.distribucionPlanes} />
        </Card>
      </div>

      {/* FILA 3 — Lists */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: grid.listColumns,
          gap: grid.gap,
        }}
      >
        {/* Top Socios */}
        <Card
          className="p-5"
          style={cardStyle()}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: colors.amberBg, color: colors.amber }}
            >
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 style={{ ...textStyle("body"), fontWeight: fontWeight.semibold }}>
                Top Socios
              </h3>
              <p style={{ ...textStyle("caption"), marginTop: 1 }}>
                Más asiduos del mes
              </p>
            </div>
          </div>
          <TopSociosList data={stats.topSocios} />
        </Card>

        {/* Debtors */}
        <Card
          className="p-5"
          style={cardStyle()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: colors.dangerBg, color: colors.danger }}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 style={{ ...textStyle("body"), fontWeight: fontWeight.semibold }}>
                  Socios con Deuda
                </h3>
                <p style={{ ...textStyle("caption"), marginTop: 1 }}>
                  {stats.sociosConDeuda > 0
                    ? `${stats.sociosConDeuda} pendiente${
                        stats.sociosConDeuda > 1 ? "s" : ""
                      }`
                    : "Sin deudas"}
                </p>
              </div>
            </div>
            {stats.sociosConDeuda > 0 && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: colors.dangerBg,
                  color: colors.danger,
                }}
              >
                {stats.sociosConDeuda}
              </div>
            )}
          </div>
          <DebtorsPanel
            data={socios?.filter((s) => s.tieneDeuda).slice(0, 5) ?? []}
          />
        </Card>
      </div>
    </div>
  );
}
