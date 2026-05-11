'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, Edit2, RefreshCw, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuickActionsMenuProps {
  onView: () => void;
  onEdit: () => void;
  onRenew: () => void;
  onNotify: () => void;
}

export function QuickActionsMenu({ onView, onEdit, onRenew, onNotify }: QuickActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setIsOpen(false);
  };

  const ACTIONS = [
    { id: 'view', label: 'Ver Perfil', icon: Eye, color: 'text-primary', action: onView },
    { id: 'edit', label: 'Editar Socio', icon: Edit2, color: 'text-blue-500', action: onEdit },
    { id: 'renew', label: 'Renovar', icon: RefreshCw, color: 'text-success', action: onRenew },
    { id: 'notify', label: 'Notificar', icon: Bell, color: 'text-amber-500', action: onNotify },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "p-2 rounded-xl transition-all duration-300",
          isOpen ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
        )}
        aria-label="Menú de acciones"
      >
        <MoreHorizontal size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-full mt-3 z-50 w-52 rounded-2xl bg-[#161618]/95 border border-white/10 backdrop-blur-xl shadow-2xl p-1.5 overflow-hidden"
          >
            {ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={(e) => handleAction(e, action.action)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all group"
                >
                  <Icon size={14} className={cn(action.color, "group-hover:scale-110 transition-transform")} />
                  {action.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
