'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface ClockDisplayProps {
  className?: string;
}

export function ClockDisplay({ className }: ClockDisplayProps) {
  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now);

      const hour = now.getHours();
      if (hour < 12) setGreeting('Buenos días');
      else if (hour < 18) setGreeting('Buenas tardes');
      else setGreeting('Buenas noches');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateString = time.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-center text-muted-foreground font-sans tracking-wide uppercase">
        {greeting}
      </p>

      <div className="relative rounded-2xl p-4 sm:p-6 glass-card border-t border-border">
        <div className="absolute top-0 left-0 h-1 rounded-tl-2xl bg-gradient-to-r from-primary to-transparent w-2/5 opacity-80" />

        <p className="text-center text-4xl sm:text-5xl md:text-6xl font-bold tabular-nums font-mono text-foreground tracking-tight leading-none">
          {timeString}
        </p>
        <p className="text-center mt-1 sm:mt-2 text-xs sm:text-sm font-sans text-muted-foreground">
          {formattedDate}
        </p>
      </div>
    </motion.div>
  );
}

export function UserPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center mb-2 sm:mb-4"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-2xl flex items-center justify-center bg-primary/15 shadow-inner border border-primary/20">
        <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
      </div>
      <h2 className="text-base sm:text-lg font-bold font-heading text-foreground">
        Ingresá tu DNI
      </h2>
      <p className="text-xs sm:text-sm mt-0.5 text-muted-foreground font-sans">
        Tocá los números para buscar
      </p>
    </motion.div>
  );
}
