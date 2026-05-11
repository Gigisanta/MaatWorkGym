'use client';

import { useState } from 'react';
import { Copy, Edit2, Trash2, Link as LinkIcon, MoreVertical, UserPlus, UtensilsCrossed, Sparkles, Clock, Apple } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Socio {
  id: string;
  nombre: string;
  apellido: string;
}

interface ItemComida {
  id: string;
  alimento: string;
  cantidad: string;
  proteinas?: number | null;
  carbohidratos?: number | null;
  grasas?: number | null;
}

interface Comida {
  id: string;
  nombre: string;
  hora: string;
  items: ItemComida[];
}

interface Dieta {
  id: string;
  nombre: string;
  descripcion?: string | null;
  tipo: string;
  token?: string | null;
  socio?: Socio | null;
  comidas: Comida[];
}

interface DietaCardProps {
  dieta: Dieta;
  onEdit: (dieta: Dieta) => void;
  onDelete: (id: string) => void;
  onCopyLink?: (token: string) => void;
  onAsignar?: (dieta: Dieta) => void;
}

export function DietaCard({ dieta, onEdit, onDelete, onCopyLink, onAsignar }: DietaCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const totalItems = dieta.comidas.reduce((acc, c) => acc + c.items.length, 0);
  const horarios = dieta.comidas.map(c => c.hora).sort();

  const handleCopyLink = () => {
    if (dieta.token) {
      const url = `${window.location.origin}/publico/${dieta.token}`;
      navigator.clipboard.writeText(url);
      onCopyLink?.(dieta.token);
    }
  };

  return (
    <motion.div 
      layout
      className="group relative flex flex-col bg-white/[0.03] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10 hover:shadow-2xl hover:shadow-primary/5"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-success/10 transition-colors" />

      <div className="p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={cn(
                "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em]",
                dieta.tipo === 'generica' 
                  ? "bg-primary text-white" 
                  : "bg-success text-white"
              )}>
                {dieta.tipo === 'generica' ? 'Genérica' : 'Personalizada'}
              </Badge>
              {dieta.token && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black text-amber-500 uppercase tracking-widest">
                  <Sparkles size={8} />
                  Pública
                </div>
              )}
            </div>
            <h3 className="text-xl font-black text-white tracking-tight group-hover:text-primary transition-colors">
              {dieta.nombre}
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
                      onClick={() => { onEdit(dieta); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all text-white"
                    >
                      <Edit2 size={14} className="text-primary" /> Editar Perfil
                    </button>
                    {dieta.tipo === 'generica' && onAsignar && (
                      <button
                        onClick={() => { onAsignar(dieta); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all text-white"
                      >
                        <UserPlus size={14} className="text-success" /> Asignar Socio
                      </button>
                    )}
                    {dieta.token && (
                      <button
                        onClick={() => { handleCopyLink(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all text-white"
                      >
                        <Copy size={14} className="text-amber-500" /> Copiar Enlace
                      </button>
                    )}
                    <div className="h-px bg-white/5 my-1 mx-2" />
                    <button
                      onClick={() => { onDelete(dieta.id); setShowMenu(false); }}
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

        {dieta.descripcion && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-6 font-medium">
            {dieta.descripcion}
          </p>
        )}

        <div className="flex items-center gap-8 mb-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">Estructura</span>
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={12} className="text-primary" />
              <span className="text-sm font-black text-white">{dieta.comidas.length} <span className="text-[10px] font-bold text-muted-foreground/60">Comidas</span></span>
            </div>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-8">
            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">Variedad</span>
            <div className="flex items-center gap-2">
              <Apple size={12} className="text-success" />
              <span className="text-sm font-black text-white">{totalItems} <span className="text-[10px] font-bold text-muted-foreground/60">Items</span></span>
            </div>
          </div>
        </div>

        {horarios.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {horarios.map((hora, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-white shadow-sm"
              >
                <Clock size={10} className="text-primary" />
                {hora}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto p-6 flex gap-3 bg-white/[0.02] border-t border-white/5">
        {dieta.socio ? (
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
              {dieta.socio.nombre[0]}{dieta.socio.apellido[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Asignado a</p>
              <p className="text-[10px] font-bold text-white truncate">{dieta.socio.nombre} {dieta.socio.apellido}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onEdit(dieta)}
            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10 flex items-center justify-center gap-2"
          >
            <Apple size={14} className="text-primary" />
            Configurar Dieta
          </button>
        )}
        
        {dieta.token && (
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
