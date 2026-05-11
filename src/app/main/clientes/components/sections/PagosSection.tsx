'use client';
import { useState, useMemo } from 'react';
import { Search, Receipt } from 'lucide-react';

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function Badge({
  variant = 'default',
  children,
}: {
  variant?: 'default' | 'success' | 'warning';
  children: React.ReactNode;
}) {
  const variants: Record<string, string> = {
    default: 'bg-secondary text-muted-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-amber-500/10 text-amber-500',
  };
  return (
    <span className={'px-2 py-1 rounded-lg text-sm font-medium ' + variants[variant]}>
      {children}
    </span>
  );
}

function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const initials = nombre[0] + apellido[0];
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary flex items-center justify-center font-bold text-white text-sm">
      {initials}
    </div>
  );
}

interface PagoType {
  id: string;
  socioId: string;
  monto: number;
  metodo: string;
  mes: number;
  anio: number;
  fechaPago: Date;
  socio?: { nombre: string; apellido: string; dni: string };
}

interface PagosSectionProps {
  pagos: PagoType[];
}

export function PagosSection({ pagos }: PagosSectionProps) {
  const [filterMes, setFilterMes] = useState(new Date().getMonth() + 1);
  const [filterAnio, setFilterAnio] = useState(new Date().getFullYear());
  const [searchSocio, setSearchSocio] = useState('');

  const filteredPagos = useMemo(() => {
    return pagos.filter((p) => {
      if (p.mes !== filterMes || p.anio !== filterAnio) return false;
      if (searchSocio.trim()) {
        const fullName = (p.socio?.nombre || '') + ' ' + (p.socio?.apellido || '');
        return fullName.toLowerCase().includes(searchSocio.toLowerCase());
      }
      return true;
    });
  }, [pagos, filterMes, filterAnio, searchSocio]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pagos</h2>
          <p className="text-muted-foreground">Historial de pagos registrados</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <select
              value={filterMes}
              onChange={(e) => setFilterMes(parseInt(e.target.value))}
              className="px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none transition-colors text-sm"
              aria-label="Filtrar por mes"
            >
              {MESES.map((mes, i) => (
                <option key={i} value={i + 1}>
                  {mes}
                </option>
              ))}
            </select>
            <select
              value={filterAnio}
              onChange={(e) => setFilterAnio(parseInt(e.target.value))}
              className="px-3 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none transition-colors text-sm"
              aria-label="Filtrar por año"
            >
              <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
            </select>
          </div>
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              value={searchSocio}
              onChange={(e) => setSearchSocio(e.target.value)}
              placeholder="Buscar por cliente..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors text-sm"
            />
          </div>
        </div>
      </div>

      {filteredPagos.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-card">
          <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold mb-2">Sin pagos</h3>
          <p className="text-muted-foreground">No hay pagos registrados para este periodo</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Cliente
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Metodo
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPagos.map((pago) => (
                  <tr
                    key={pago.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          nombre={pago.socio?.nombre || '?'}
                          apellido={pago.socio?.apellido || '?'}
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {pago.socio?.nombre} {pago.socio?.apellido}
                          </p>
                          <p className="text-xs text-muted-foreground">{pago.socio?.dni}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(pago.fechaPago).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={pago.metodo === 'efectivo' ? 'success' : 'default'}>
                        {pago.metodo === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-primary"></span>
                    </td>
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
