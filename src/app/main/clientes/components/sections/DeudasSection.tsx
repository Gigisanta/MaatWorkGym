'use client';
import { useMemo } from 'react';
import { DollarSign, CheckCircle2 } from 'lucide-react';

function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const initials = nombre[0] + apellido[0];
  return (
    <div className="relative">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary flex items-center justify-center font-bold text-white">
        {initials}
      </div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background bg-amber-500" />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
      {children}
    </span>
  );
}

interface SocioType {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  tieneDeuda: boolean;
  plan?: { nombre: string; precio: number };
}

interface DeudasSectionProps {
  socios: SocioType[];
  onRegisterPayment: (socioId: string) => void;
}

export function DeudasSection({ socios, onRegisterPayment }: DeudasSectionProps) {
  const deudores = useMemo(() => {
    return socios.filter((s) => s.tieneDeuda).sort((a, b) => a.apellido.localeCompare(b.apellido));
  }, [socios]);

  const totalDeuda = useMemo(() => {
    return deudores.reduce((sum, s) => sum + (s.plan?.precio || 0), 0);
  }, [deudores]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Clientes con Deuda</h2>
          <p className="text-muted-foreground">
            {deudores.length} socios pendientes de pago
          </p>
        </div>
        {deudores.length > 0 && (
          <span className="px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 text-base font-medium">
            Total estimado: ${totalDeuda.toLocaleString()}
          </span>
        )}
      </div>

      {deudores.length === 0 ? (
        <div className="text-center py-20 rounded-2xl glass-card">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-success" />
          <h3 className="text-xl font-semibold mb-2">Sin deudas!</h3>
          <p className="text-muted-foreground">
            Todos los socios estan al dia con sus pagos
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {deudores.map((socio) => (
            <div
              key={socio.id}
              className="glass-card rounded-xl p-4 hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-center gap-4">
                <Avatar nombre={socio.nombre} apellido={socio.apellido} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">
                    {socio.nombre} {socio.apellido}
                  </h3>
                  <p className="text-sm text-muted-foreground">DNI {socio.dni}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge>{socio.plan?.nombre}</Badge>
                    <span className="text-sm text-muted-foreground/50">
                      ${socio.plan?.precio}/mes
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-500">
                    ${socio.plan?.precio.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">adeudado</p>
                </div>
                <button
                  onClick={() => onRegisterPayment(socio.id)}
                  className="px-4 py-2 rounded-lg bg-success text-white font-medium transition-colors flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Cobrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
