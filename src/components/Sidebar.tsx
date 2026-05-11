'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Users,
  BarChart3,
  Dumbbell,
  UtensilsCrossed,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    id: 'clientes',
    label: 'Clientes',
    href: '/main/clientes',
    icon: Users,
    description: 'Gestionar socios',
  },
  {
    id: 'fichaje',
    label: 'Fichaje',
    href: '/main/fichaje',
    icon: Activity,
    description: 'Registro de ingresos',
  },
  {
    id: 'rutinas',
    label: 'Rutinas',
    href: '/main/rutinas',
    icon: Dumbbell,
    description: 'Planes de ejercicio',
  },
  {
    id: 'dietas',
    label: 'Dietas',
    href: '/main/dietas',
    icon: UtensilsCrossed,
    description: 'Planes nutricionales',
  },
  {
    id: 'estadisticas',
    label: 'Estadísticas',
    href: '/main/estadisticas',
    icon: BarChart3,
    description: 'Reportes y métricas',
  },
];

interface SidebarProps {
  activeSection?: string;
}

export default function Sidebar({ activeSection }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col h-[100dvh] bg-sidebar border-r border-sidebar-border z-50">
      {/* Logo Section */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center shadow-md">
            <Dumbbell className="w-6 h-6 text-[#1a1a1a]" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-heading text-2xl font-bold text-sidebar-foreground tracking-tight">
              SEVJO
            </h1>
            <span className="text-xs text-sidebar-foreground/60 font-medium">
              Gestión de Gimnasio
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {/* Nav Items */}
        {navItems.map((item) => {
          const isActive = activeSection === item.id || pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-150",
                isActive
                  ? "bg-primary text-[#1a1a1a]"
                  : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-colors font-semibold"
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}