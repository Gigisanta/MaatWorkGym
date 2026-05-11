'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, Loader2, Utensils } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ComidaForm {
  id: string;
  nombre: string;
  hora: string;
  items: { id: string; alimento: string; cantidad: string; proteinas: string; carbohidratos: string; grasas: string }[];
}

interface DietaFormData {
  id?: string;
  nombre: string;
  descripcion: string;
  comidas: ComidaForm[];
}

interface Dieta {
  id: string;
  nombre: string;
  descripcion?: string | null;
  comidas: {
    id: string;
    nombre: string;
    hora: string;
    items: {
      id: string;
      alimento: string;
      cantidad: string;
      proteinas?: number | null;
      carbohidratos?: number | null;
      grasas?: number | null;
    }[];
  }[];
}

interface DietaCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dieta?: Dieta | null;
  onSave: (data: { nombre: string; descripcion?: string; comidas: { nombre: string; hora: string; items: { alimento: string; cantidad: string; proteinas?: number; carbohidratos?: number; grasas?: number }[]; orden: number }[] }) => void;
  isLoading?: boolean;
}

function generarId() {
  return Math.random().toString(36).substring(2, 11);
}

export function DietaCreator({ open, onOpenChange, dieta, onSave, isLoading }: DietaCreatorProps) {
  const [formData, setFormData] = useState<DietaFormData>({
    nombre: '',
    descripcion: '',
    comidas: [],
  });

  useEffect(() => {
    if (dieta) {
      setFormData({
        id: dieta.id,
        nombre: dieta.nombre,
        descripcion: dieta.descripcion || '',
        comidas: dieta.comidas.map(c => ({
          id: c.id,
          nombre: c.nombre,
          hora: c.hora,
          items: c.items.map(i => ({
            id: i.id,
            alimento: i.alimento,
            cantidad: i.cantidad,
            proteinas: i.proteinas?.toString() || '',
            carbohidratos: i.carbohidratos?.toString() || '',
            grasas: i.grasas?.toString() || '',
          })),
        })),
      });
    } else {
      setFormData({ nombre: '', descripcion: '', comidas: [] });
    }
  }, [dieta, open]);

  const agregarComida = () => {
    setFormData({
      ...formData,
      comidas: [
        ...formData.comidas,
        { id: generarId(), nombre: '', hora: '08:00', items: [] },
      ],
    });
  };

  const agregarItem = (comidaId: string) => {
    setFormData({
      ...formData,
      comidas: formData.comidas.map(c =>
        c.id === comidaId
          ? {
              ...c,
              items: [
                ...c.items,
                { id: generarId(), alimento: '', cantidad: '', proteinas: '', carbohidratos: '', grasas: '' },
              ],
            }
          : c
      ),
    });
  };

  const actualizarComida = (comidaId: string, campo: 'nombre' | 'hora', valor: string) => {
    setFormData({
      ...formData,
      comidas: formData.comidas.map(c =>
        c.id === comidaId ? { ...c, [campo]: valor } : c
      ),
    });
  };

  const actualizarItem = (comidaId: string, itemId: string, campo: string, valor: string) => {
    setFormData({
      ...formData,
      comidas: formData.comidas.map(c =>
        c.id === comidaId
          ? {
              ...c,
              items: c.items.map(i =>
                i.id === itemId ? { ...i, [campo]: valor } : i
              ),
            }
          : c
      ),
    });
  };

  const eliminarComida = (comidaId: string) => {
    setFormData({
      ...formData,
      comidas: formData.comidas.filter(c => c.id !== comidaId),
    });
  };

  const eliminarItem = (comidaId: string, itemId: string) => {
    setFormData({
      ...formData,
      comidas: formData.comidas.map(c =>
        c.id === comidaId
          ? { ...c, items: c.items.filter(i => i.id !== itemId) }
          : c
      ),
    });
  };

  const handleSubmit = () => {
    const comidasOrdenadas = formData.comidas
      .map((c, index) => ({
        nombre: c.nombre,
        hora: c.hora,
        items: c.items
          .filter(i => i.alimento.trim())
          .map((i) => ({
            alimento: i.alimento,
            cantidad: i.cantidad,
            proteinas: i.proteinas ? parseFloat(i.proteinas) : undefined,
            carbohidratos: i.carbohidratos ? parseFloat(i.carbohidratos) : undefined,
            grasas: i.grasas ? parseFloat(i.grasas) : undefined,
          })),
        orden: index,
      }))
      .filter(c => c.items.length > 0);

    onSave({
      nombre: formData.nombre,
      descripcion: formData.descripcion || undefined,
      comidas: comidasOrdenadas,
    });
  };

  const isEditing = !!dieta?.id;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-4xl bg-card border-border shadow-xl rounded-2xl overflow-hidden flex flex-col p-0">
        <ModalHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  {isEditing ? 'Editar Dieta' : 'Nueva Dieta'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isEditing ? 'Actualiza los detalles del plan alimenticio' : 'Diseña un nuevo plan de alimentación'}
                </p>
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

        <ModalBody className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dieta-nombre" className="text-sm font-medium text-foreground">
                Nombre del Plan <span className="text-destructive">*</span>
              </label>
              <input
                id="dieta-nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:border-primary/50 outline-none transition-all"
                placeholder="Ej: Dieta de Definición"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dieta-descripcion" className="text-sm font-medium text-foreground">
                Descripción
              </label>
              <input
                id="dieta-descripcion"
                type="text"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:border-primary/50 outline-none transition-all"
                placeholder="Ej: Orientada a pérdida de grasa"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                Estructura de Comidas
                <Badge variant="secondary">{formData.comidas.length}</Badge>
              </h3>
              <button
                onClick={agregarComida}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors border border-primary/20"
              >
                <Plus size={14} />
                Añadir Comida
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {formData.comidas.map((comida) => (
                  <motion.div
                    key={comida.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-xl border border-border bg-card overflow-hidden"
                  >
                    <div className="p-4 bg-muted/50 border-b border-border flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-1.5 border border-border">
                        <Clock size={14} className="text-primary" />
                        <input
                          type="time"
                          value={comida.hora}
                          onChange={(e) => actualizarComida(comida.id, 'hora', e.target.value)}
                          className="bg-transparent text-sm font-medium text-foreground outline-none"
                          aria-label="Hora de la comida"
                        />
                      </div>
                      <input
                        type="text"
                        value={comida.nombre}
                        onChange={(e) => actualizarComida(comida.id, 'nombre', e.target.value)}
                        className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 outline-none"
                        placeholder="Nombre (ej: Pre-entreno)"
                        aria-label="Nombre de la comida"
                      />
                      <button
                        onClick={() => eliminarComida(comida.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Eliminar comida"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      {comida.items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="col-span-5">
                            <input
                              type="text"
                              value={item.alimento}
                              onChange={(e) => actualizarItem(comida.id, item.id, 'alimento', e.target.value)}
                              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                              placeholder="Alimento..."
                              aria-label="Alimento"
                            />
                          </div>
                          <div className="col-span-7 grid grid-cols-4 gap-2">
                            <input
                              type="text"
                              value={item.cantidad}
                              onChange={(e) => actualizarItem(comida.id, item.id, 'cantidad', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs text-center text-foreground placeholder:text-muted-foreground/60 outline-none"
                              placeholder="Cant"
                              aria-label="Cantidad"
                            />
                            <input
                              type="number"
                              value={item.proteinas}
                              onChange={(e) => actualizarItem(comida.id, item.id, 'proteinas', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs text-center text-primary placeholder:text-muted-foreground/60 outline-none"
                              placeholder="P"
                              step="0.1"
                              aria-label="Proteínas"
                            />
                            <input
                              type="number"
                              value={item.carbohidratos}
                              onChange={(e) => actualizarItem(comida.id, item.id, 'carbohidratos', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs text-center text-amber-600 placeholder:text-muted-foreground/60 outline-none"
                              placeholder="C"
                              step="0.1"
                              aria-label="Carbohidratos"
                            />
                            <input
                              type="number"
                              value={item.grasas}
                              onChange={(e) => actualizarItem(comida.id, item.id, 'grasas', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-md bg-background border border-border text-xs text-center text-emerald-600 placeholder:text-muted-foreground/60 outline-none"
                              placeholder="G"
                              step="0.1"
                              aria-label="Grasas"
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => agregarItem(comida.id)}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary text-sm transition-colors"
                      >
                        <Plus size={14} />
                        Añadir Alimento
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {formData.comidas.length === 0 && (
                <div className="py-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-border">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Utensils size={20} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Empieza añadiendo la primera comida del día</p>
                  <button
                    onClick={agregarComida}
                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Añadir Comida
                  </button>
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
            onClick={handleSubmit}
            disabled={!formData.nombre.trim() || formData.comidas.length === 0 || isLoading}
            className="flex-[2] py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Plus size={16} />
                {isEditing ? 'Guardar Cambios' : 'Crear Dieta'}
              </>
            )}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
