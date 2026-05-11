'use client';

import { useState } from 'react';
import { Copy, Edit2, Trash2, Link as LinkIcon, MoreVertical, UserPlus, Dumbbell, Sparkles, Target, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const NOMBRES_DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

interface Socio {
  id: string;
  nombre: string;
  apellido: string;
}

interface Rutina {
  id: string;
  nombre: string;
  descripcion?: string | null;
  tipo: string;
  token?: string | null;
  socio?: Socio | null;
  dias: DiaRutina[];
}

interface RutinaCardProps {
  rutina: Rutina;
  onEdit: (rutina: Rutina) => void;
  onDelete: (id: string) => void;
  onCopyLink?: (token: string) => void;
  onAsignar?: (rutina: Rutina) => void;
}

export function RutinaCard({ rutina, onEdit, onDelete, onCopyLink, onAsignar }: RutinaCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const diasActivos = rutina.dias.map(d => d.diaSemana).sort();
  const totalEjercicios = rutina.dias.reduce((acc, d) => acc + d.ejercicios.length, 0);

  const handleCopyLink = () => {
    if (rutina.token) {
      const url = `${window.location.origin}/publico/${rutina.token}`;
      navigator.clipboard.writeText(url);
      onCopyLink?.(rutina.token);
    }
  };

  return (
    <motion.div
      layout
      className="group relative flex flex-col bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10 hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

      <div className="p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={cn(
                "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em]",
                rutina.tipo === 'generica'
                  ? "bg-primary text-white"
                  : "bg-success text-white"
              )}>
                {rutina.tipo === 'generica' ? 'Genérica' : 'Personalizada'}
              </Badge>
              {rutina.token && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-amber-500 uppercase tracking-widest">
                  <Sparkles size={8} />
                  Pública
                </div>
              )}
            </div>
            <h3 className="text-xl font-black text-white tracking-tight group-hover:text-primary transition-colors">
              {rutina.nombre}
            </h3>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                showMenu ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5"
              )}
            >
              <MoreVertical size={18} />
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-full mt-3 z-50 w-56 rounded-2xl border border-white/10 bg-[#161618]/95 backdrop-blur-xl p-1.5 shadow-2xl"
                  >
                    <button
                      onClick={() => { onEdit(rutina); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all text-white"
                    >
                      <Edit2 size={14} className="text-primary" /> Editar
                    </button>
                    {rutina.tipo === 'generica' && onAsignar && (
                      <button
                        onClick={() => { onAsignar(rutina); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all text-white"
                      >
                        <UserPlus size={14} className="text-success" /> Asignar Socio
                      </button>
                    )}
                    {rutina.token && (
                      <button
                        onClick={() => { handleCopyLink(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all text-white"
                      >
                        <Copy size={14} className="text-amber-500" /> Copiar Enlace
                      </button>
                    )}
                    <div className="h-px bg-white/5 my-1 mx-2" />
                    <button
                      onClick={() => { onDelete(rutina.id); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-destructive/10 text-destructive transition-all"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {rutina.descripcion && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-6 font-medium">
            {rutina.descripcion}
          </p>
        )}

        <div className="grid grid-cols-7 gap-2 mb-8">
          {DIAS_SEMANA.map((dia, i) => {
            const isActive = diasActivos.includes(i);
            return (
              <div
                key={dia}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-500",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                    : "bg-white/[0.02] text-muted-foreground/20 border border-white/5"
                )}
                title={NOMBRES_DIAS[i]}
              >
                {dia}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">Volumen</span>
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-primary" />
              <span className="text-sm font-black text-white">{totalEjercicios} <span className="text-[10px] font-bold text-muted-foreground/60">Ejs</span></span>
            </div>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-8">
            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">Frecuencia</span>
            <div className="flex items-center gap-2">
              <Target size={12} className="text-success" />
              <span className="text-sm font-black text-white">{rutina.dias.length} <span className="text-[10px] font-bold text-muted-foreground/60">Días</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto p-6 flex gap-3 bg-white/[0.02] border-t border-white/5">
        {rutina.socio ? (
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
              {rutina.socio.nombre[0]}{rutina.socio.apellido[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Asignado a</p>
              <p className="text-[10px] font-bold text-white truncate">{rutina.socio.nombre} {rutina.socio.apellido}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onEdit(rutina)}
            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10 flex items-center justify-center gap-2"
          >
            <Dumbbell size={14} className="text-primary" />
            Configurar Rutina
          </button>
        )}

        {rutina.token && (
          <button
            onClick={handleCopyLink}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-lg"
            title="Copiar Link de Acceso"
          >
            <LinkIcon size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}