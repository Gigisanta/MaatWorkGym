'use client';

import { useState, useEffect } from 'react';
import { X, User, Loader2, Search } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

interface Socio {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
}

interface AsignarDietaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dieta: any;
  socios: Socio[];
  onAsignar: (socioId: string) => void;
  isLoading: boolean;
}

export function AsignarDietaModal({
  open,
  onOpenChange,
  dieta,
  socios,
  onAsignar,
  isLoading,
}: AsignarDietaModalProps) {
  const [socioId, setSocioId] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (open) {
      setSocioId('');
      setSearch('');
    }
  }, [open]);

  const filteredSocios = socios.filter(s =>
    `${s.nombre} ${s.apellido} ${s.dni}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-lg bg-card border-border shadow-xl rounded-2xl overflow-hidden flex flex-col p-0">
        <ModalHeader className="p-6 pb-0 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">Asignar Dieta</h2>
                {dieta && (
                  <p className="text-sm text-muted-foreground">
                    Plan: <span className="font-medium text-primary">{dieta.nombre}</span>
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

        <ModalBody className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
          <div className="space-y-3">
            <label htmlFor="buscar-cliente" className="text-sm font-medium text-foreground">
              Seleccionar Cliente
            </label>
            <div className="relative group">
              <input
                id="buscar-cliente"
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

            <div className="max-h-60 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2 custom-scrollbar">
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
        </ModalBody>

        <ModalFooter className="p-6 pt-4 border-t border-border bg-muted/50 flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onAsignar(socioId)}
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
