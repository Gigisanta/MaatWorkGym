'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Users, CreditCard, BarChart3, Dumbbell } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/main/fichaje');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(124,58,237,0.15),transparent_70%)]" />

      <div className="relative z-10 text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-4 text-gradient">
          GymPro
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-16 font-sans">
          Sistema de Gestión Integral
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Activity, label: 'Fichaje', desc: 'Registro de entradas' },
            { icon: Users, label: 'Clientes', desc: 'Gestión de socios' },
            { icon: CreditCard, label: 'Pagos', desc: 'Control de cobros' },
            { icon: BarChart3, label: 'Stats', desc: 'Estadísticas' },
          ].map((item, i) => (
            <div
              key={i}
              className={`glass-card p-6 text-center flex flex-col items-center justify-center animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">{item.label}</h3>
              <p className="font-sans text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-t-2 border-primary animate-spin" />
          <p className="text-muted-foreground font-sans font-medium">Iniciando sistema...</p>
        </div>
      </div>
    </main>
  );
}
