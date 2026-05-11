'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSocioByDni, useCreateSocio } from '@/hooks/useSocios';
import { useCreateFichaje } from '@/hooks/useFichajes';
import { usePlanes } from '@/hooks/usePlanes';
import { ArrowRight, AlertCircle, CheckCircle2, Fingerprint, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericKeypad, ClockDisplay, UserPrompt, MemberCard, RegisterModal } from '@/components/fichaje';
import { cn } from '@/lib/utils';

export default function FichajePage() {
  const router = useRouter();
  const [dni, setDni] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [justFichado, setJustFichado] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [fichadoId, setFichadoId] = useState<string | null>(null);

  const { data: socio, refetch } = useSocioByDni(dni);
  const createFichaje = useCreateFichaje();
  const createSocio = useCreateSocio();
  const { data: planes } = usePlanes();

  const handleClear = useCallback(() => {
    setDni('');
    setShowCard(false);
    setNotFound(false);
    setJustFichado(false);
  }, []);

  const handleBackspace = useCallback(() => {
    setDni((prev) => prev.slice(0, -1));
  }, []);

  const handleDigit = useCallback(
    (digit: string) => {
      if (dni.length < 12) {
        setDni((prev) => prev + digit);
      }
    },
    [dni],
  );

  const handleFichar = useCallback(
    async (socioId?: string) => {
      const id = socioId || socio?.id;
      if (!id) return;
      try {
        await createFichaje.mutateAsync(id);
        setJustFichado(true);
        setShowToast(true);
        setFichadoId(id);
        setTimeout(() => {
          router.push(`/main/clientes?fichado=${id}`);
        }, 1200);
      } catch {
      }
    },
    [socio?.id, createFichaje, router],
  );

  const handleSearch = useCallback(async () => {
    if (dni.length < 6) return;
    setShowCard(false);
    setNotFound(false);
    setJustFichado(false);
    setIsSearching(true);
    const result = await refetch();
    setIsSearching(false);
    if (result.data) {
      setShowCard(true);
      setNotFound(false);
      setTimeout(() => handleFichar(result.data.id), 3000);
    } else {
      setNotFound(true);
      setShowCard(false);
    }
  }, [dni, refetch, handleFichar]);

  const handleRegister = async (data: {
    nombre: string;
    apellido: string;
    dni: string;
    planId: string;
    fechaInicio: string;
  }) => {
    try {
      await createSocio.mutateAsync(data);
      setShowRegisterModal(false);
      setDni(data.dni);
    } catch {
    }
  };

  return (
    <div className="flex flex-col min-w-0 relative overflow-hidden items-center justify-center p-4 sm:p-8 h-full bg-background">
        {/* Toast Notification */}
        <AnimatePresence mode="wait">
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
            >
              <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-card border border-success/30 shadow-lg">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Acceso Autorizado</p>
                  <p className="text-xs text-muted-foreground">Redirigiendo...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-lg flex flex-col gap-6 relative z-10">
          {/* Header & Clock Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                Sistema de Control
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground">
                <Fingerprint size={12} className="text-primary" />
                Biometric
              </div>
            </div>
            <ClockDisplay className="w-full" />
          </div>

          {/* Main Interaction Area */}
          <div className="relative min-h-[420px] flex flex-col">
            <AnimatePresence mode="wait">
              {notFound ? (
                <motion.div
                  key="not-found"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex flex-col"
                >
                  <div className="flex-1 rounded-2xl bg-card border border-border/60 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-xl bg-destructive/10 flex items-center justify-center mb-6 border border-destructive/20">
                      <AlertCircle size={32} className="text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Socio No Encontrado</h3>
                    <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                      El DNI ingresado no corresponde a ningún socio activo.
                    </p>
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        onClick={handleClear}
                        className="px-4 py-3 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
                      >
                        Reintentar
                      </button>
                      <button
                        onClick={() => setShowRegisterModal(true)}
                        className="px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <UserPlus size={16} />
                        Registrar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : showCard && socio ? (
                <motion.div
                  key="member-card"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <MemberCard
                    socio={socio}
                    isFichado={justFichado}
                    isSearching={isSearching}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="keypad-section"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full space-y-5"
                >
                  <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border/60 shadow-sm">
                    <UserPrompt />

                    <div className="mt-6 mb-8">
                      <NumericKeypad
                        value={dni}
                        onDigit={handleDigit}
                        onBackspace={handleBackspace}
                        onClear={handleClear}
                        maxLength={12}
                      />
                    </div>

                    <button
                      onClick={handleSearch}
                      disabled={dni.length < 6}
                      className={cn(
                        "w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-150",
                        dni.length >= 6
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground/50 cursor-not-allowed"
                      )}
                    >
                      Verificar Acceso
                      {dni.length >= 6 && <ArrowRight size={16} className="animate-pulse" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      <RegisterModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
        initialDni={dni}
        planes={planes || []}
        onRegister={handleRegister}
        isLoading={createSocio.isPending}
      />
    </div>
  );
}
