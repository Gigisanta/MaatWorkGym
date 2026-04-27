"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Users, CreditCard, BarChart3 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/fichaje");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(124, 58, 237, 0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-violet-200 via-violet-400 to-violet-200 bg-clip-text text-transparent">
          GIMNASIO APP
        </h1>
        <p className="text-xl text-slate-400 mb-12">Sistema de Gestión Integral</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { icon: Activity, label: "Fichaje", desc: "Registro de entradas" },
            { icon: Users, label: "Clientes", desc: "Gestión de socios" },
            { icon: CreditCard, label: "Pagos", desc: "Control de cobros" },
            { icon: BarChart3, label: "Stats", desc: "Estadísticas" },
          ].map((item, i) => (
            <div
              key={i}
              className="card p-6 text-center animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <item.icon className="w-8 h-8 mx-auto mb-3 text-violet-400" />
              <h3 className="font-semibold text-lg">{item.label}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-slate-500 animate-pulse">Redirigiendo...</p>
      </div>
    </main>
  );
}
