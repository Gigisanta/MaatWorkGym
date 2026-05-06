"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Activity, Users, BarChart3, Dumbbell, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/fichaje", label: "Fichaje", icon: Activity },
  { href: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { href: "/clientes", label: "Clientes", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "64px" : "200px"
    );
  }, [collapsed]);

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40"
      style={{
        width: collapsed ? "64px" : "200px",
        background: "var(--bg-sidebar)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center border-b border-white/5"
        style={{ padding: collapsed ? "20px 12px" : "20px" }}
      >
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
          >
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span
              className="font-bold text-lg whitespace-nowrap"
              style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
            >
              GymPro
            </span>
          )}
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl transition-all ${
                isActive
                  ? "bg-[#7C3AED] text-white shadow-lg shadow-violet-500/20"
                  : "text-[#64748B] hover:text-white hover:bg-white/5"
              }`}
              style={{
                padding: collapsed ? "16px" : "16px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-6 h-6 shrink-0" />
              {!collapsed && (
                <span
                  className="font-semibold text-base ml-3 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-[#64748B] hover:text-white hover:bg-white/5 transition-all"
          title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xs">Colapsar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
