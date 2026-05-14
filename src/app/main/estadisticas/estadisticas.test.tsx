import { describe, it, expect } from 'vitest';

// Test the stats computation logic without rendering the page
// The actual stats logic is in the useMemo of the EstadisticasPage

describe('Estadisticas data logic', () => {
  // Replicate the stats computation from EstadisticasPage
  function computeStats(socios: any[], pagos: any[], fichajes: any[]) {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    const totalSocios = socios?.length || 0;
    const sociosAlDia = socios?.filter(s => !s.tieneDeuda).length || 0;
    const sociosConDeuda = totalSocios - sociosAlDia;

    const ingresosMes = pagos
      ?.filter((p: any) => p.mes === mesActual && p.anio === anioActual)
      .reduce((sum: number, p: any) => sum + p.monto, 0) || 0;

    const prevMonth = mesActual === 1 ? 12 : mesActual - 1;
    const prevYear = mesActual === 1 ? anioActual - 1 : anioActual;
    const ingresosAnterior = pagos
      ?.filter((p: any) => p.mes === prevMonth && p.anio === prevYear)
      .reduce((sum: number, p: any) => sum + p.monto, 0) || 0;

    const trendIngresos = ingresosAnterior > 0
      ? Math.round(((ingresosMes - ingresosAnterior) / ingresosAnterior) * 100)
      : 0;

    const visitasMes = fichajes?.filter((f: any) => {
      const fecha = new Date(f.fechaHora);
      return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual;
    }).length || 0;

    const planCounts: Record<string, number> = {};
    socios?.forEach((s: any) => {
      const nombre = s.plan?.nombre || 'Sin plan';
      planCounts[nombre] = (planCounts[nombre] || 0) + 1;
    });
    const topPlanes = Object.entries(planCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    return { totalSocios, sociosAlDia, sociosConDeuda, ingresosMes, trendIngresos, visitasMes, topPlanes };
  }

  it('computes totalSocios correctly', () => {
    const result = computeStats([{ id: '1' }, { id: '2' }], [], []);
    expect(result.totalSocios).toBe(2);
  });

  it('computes sociosAlDia and sociosConDeuda correctly', () => {
    const socios = [
      { id: '1', tieneDeuda: false },
      { id: '2', tieneDeuda: true },
      { id: '3', tieneDeuda: false },
    ];
    const result = computeStats(socios, [], []);
    expect(result.sociosAlDia).toBe(2);
    expect(result.sociosConDeuda).toBe(1);
  });

  it('computes ingresosMes correctly', () => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    const pagos = [
      { mes: mesActual, anio: anioActual, monto: 1000 },
      { mes: mesActual, anio: anioActual, monto: 2000 },
      { mes: mesActual, anio: anioActual - 1, monto: 500 }, // different year
    ];
    const result = computeStats([], pagos, []);
    expect(result.ingresosMes).toBe(3000);
  });

  it('computes trendIngresos as positive when current > previous', () => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();
    const prevMonth = mesActual === 1 ? 12 : mesActual - 1;
    const prevYear = mesActual === 1 ? anioActual - 1 : anioActual;

    const pagos = [
      { mes: mesActual, anio: anioActual, monto: 1200 },
      { mes: prevMonth, anio: prevYear, monto: 1000 },
    ];
    const result = computeStats([], pagos, []);
    expect(result.trendIngresos).toBe(20); // (1200-1000)/1000 * 100 = 20
  });

  it('computes trendIngresos as negative when current < previous', () => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();
    const prevMonth = mesActual === 1 ? 12 : mesActual - 1;
    const prevYear = mesActual === 1 ? anioActual - 1 : anioActual;

    const pagos = [
      { mes: mesActual, anio: anioActual, monto: 800 },
      { mes: prevMonth, anio: prevYear, monto: 1000 },
    ];
    const result = computeStats([], pagos, []);
    expect(result.trendIngresos).toBe(-20);
  });

  it('computes visitasMes correctly', () => {
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();

    const fichajes = [
      { id: '1', fechaHora: new Date(), tipo: 'entrada' },
      { id: '2', fechaHora: new Date(2024, 0, 1), tipo: 'entrada' }, // different month
      { id: '3', fechaHora: new Date(), tipo: 'entrada' },
    ];
    const result = computeStats([], [], fichajes);
    expect(result.visitasMes).toBe(2);
  });

  it('computes topPlanes sorted by count', () => {
    const socios = [
      { id: '1', plan: { nombre: 'Premium' } },
      { id: '2', plan: { nombre: 'Premium' } },
      { id: '3', plan: { nombre: 'Básico' } },
      { id: '4', plan: { nombre: 'Mensual' } },
    ];
    const result = computeStats(socios, [], []);
    expect(result.topPlanes[0]).toEqual({ name: 'Premium', value: 2 });
    expect(result.topPlanes[1]).toEqual({ name: 'Básico', value: 1 });
    expect(result.topPlanes[2]).toEqual({ name: 'Mensual', value: 1 });
  });

  it('handles empty data gracefully', () => {
    const result = computeStats(null as any, null as any, null as any);
    expect(result.totalSocios).toBe(0);
    expect(result.sociosAlDia).toBe(0);
    expect(result.sociosConDeuda).toBe(0);
    expect(result.ingresosMes).toBe(0);
    expect(result.visitasMes).toBe(0);
    expect(result.topPlanes).toEqual([]);
  });
});
