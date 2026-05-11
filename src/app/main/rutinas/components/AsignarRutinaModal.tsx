'use client';

import { useState, useEffect } from 'react';
import { X, User, Loader2, Search } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Socio {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
}

interface EjercicioRutina {
  id: string;
  nombre: string;
  series: number;
  repeticiones: string;
  descanso: string;
  grupoMuscular?: string | null;
}

interface DiaRutina {
  id: string;
  diaSemana: number;
  nombre?: string | null;
  ejercicios: EjercicioRutina[];
}

interface Rutina {
  id: string;
  nombre: string;
  dias: DiaRutina[];
}

interface AsignarRutinaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rutina: Rutina | null;
  socios: Socio[];
  onAsignar: (data: { rutinaId: string; socioId: string; parametros?: Record<string, any> }) => void;
  isLoading?: boolean;
}

interface ParametrosOverride {
  [ejercicioId: string]: {
    series?: number;
    repeticiones?: string;
    descanso?: string;
  };
}

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function AsignarRutinaModal({ open, onOpenChange, rutina, socios, onAsignar, isLoading }: AsignarRutinaModalProps) {
  const [socioId, setSocioId] = useState('');
  const [parametros, setParametros] = useState<ParametrosOverride>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (open) {
      setSocioId('');
      setParametros({});
      setSearch('');
    }
  }, [open]);

  const filteredSocios = socios.filter(s =>
    `${s.nombre} ${s.apellido} ${s.dni}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAsignar = () => {
    if (!socioId || !rutina) return;
    onAsignar({ rutinaId: rutina.id, socioId, parametros: Object.keys(parametros).length > 0 ? parametros : undefined });
  };

  const updateParam = (ejercicioId: string, field: 'series' | 'repeticiones' | 'descanso', value: any) => {
    setParametros(prev => ({
      ...prev,
      [ejercicioId]: {
        ...prev[ejercicioId],
        [field]: value,
      },
    }));
  };

  const getParamValue = (ejercicioId: string, field: 'series' | 'repeticiones' | 'descanso', defaultValue: any) => {
    return parametros[ejercicioId]?.[field] ?? defaultValue;
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-2xl bg-card border-border shadow-xl rounded-2xl overflow-hidden flex flex-col p-0">
        <ModalHeader className="p-6 pb-0 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">Asignar Rutina</h2>
                {rutina && (
                  <p className="text-sm text-muted-foreground">
                    Plan: <span className="font-medium text-primary">{rutina.nombre}</span>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </ModalHeader>

        <ModalBody className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
          <div className="space-y-3">
            <label htmlFor="buscar-cliente-rutina" className="text-sm font-medium text-foreground">
              Seleccionar Cliente
            </label>
            <div className="relative group">
              <input
                id="buscar-cliente-rutina"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:border-primary/50 outline-none transition-all pr-10"
                placeholder="Buscar por nombre, apellido o DNI..."
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={18} />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2 custom-scrollbar">
              {filteredSocios.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">No se encontraron clientes...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-1">
                  {filteredSocios.map((socio) => (
                    <button
                      key={socio.id}
                      onClick={() => setSocioId(socio.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                        socioId === socio.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      )}
                      aria-pressed={socioId === socio.id}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm",
                        socioId === socio.id ? "bg-white/20 text-primary-foreground" : "bg-primary/10 text-primary"
                      )}>
                        {socio.nombre[0]}{socio.apellido[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{socio.nombre} {socio.apellido}</p>
                        <p className={cn(
                          "text-xs",
                          socioId === socio.id ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          DNI {socio.dni}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {rutina && rutina.dias.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Personalizar Parámetros
                </label>
                {Object.keys(parametros).length > 0 && (
                  <Badge variant="secondary">
                    {Object.keys(parametros).length} cambios
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {rutina.dias.map((dia) => (
                  <div key={dia.id} className="rounded-xl border border-border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        {DIAS_SEMANA[dia.diaSemana]}
                      </div>
                      {dia.nombre && (
                        <span className="text-xs text-muted-foreground">
                          • {dia.nombre}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {dia.ejercicios.map((ej) => (
                        <div key={ej.id} className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-muted/30">
                          <div className="col-span-5 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate" title={ej.nombre}>
                              {ej.nombre}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {ej.grupoMuscular || 'General'}
                            </p>
                          </div>
                          <div className="col-span-7 grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <label htmlFor={`series-${ej.id}`} className="text-[10px] text-muted-foreground block text-center">Series</label>
                              <input
                                id={`series-${ej.id}`}
                                type="number"
                                value={getParamValue(ej.id, 'series', ej.series)}
                                onChange={(e) => updateParam(ej.id, 'series', parseInt(e.target.value) || 1)}
                                className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs text-center text-foreground outline-none focus:ring-2 focus:ring-ring"
                                min={1}
                              />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor={`reps-${ej.id}`} className="text-[10px] text-muted-foreground block text-center">Reps</label>
                              <input
                                id={`reps-${ej.id}`}
                                type="text"
                                value={getParamValue(ej.id, 'repeticiones', ej.repeticiones)}
                                onChange={(e) => updateParam(ej.id, 'repeticiones', e.target.value)}
                                className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs text-center text-foreground outline-none focus:ring-2 focus:ring-ring"
                              />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor={`desc-${ej.id}`} className="text-[10px] text-muted-foreground block text-center">Desc</label>
                              <input
                                id={`desc-${ej.id}`}
                                type="text"
                                value={getParamValue(ej.id, 'descanso', ej.descanso)}
                                onChange={(e) => updateParam(ej.id, 'descanso', e.target.value)}
                                className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs text-center text-foreground outline-none focus:ring-2 focus:ring-ring"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="p-6 pt-4 border-t border-border bg-muted/50 flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAsignar}
            disabled={!socioId || isLoading}
            className="flex-[2] py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Asignando...
              </div>
            ) : (
              'Confirmar Asignación'
            )}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
