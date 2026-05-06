"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSocioByDni, useCreateSocio } from "@/hooks/useSocios";
import { useCreateFichaje } from "@/hooks/useFichajes";
import { usePlanes } from "@/hooks/usePlanes";
import {
  User,
  AlertCircle,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Phone,
  Cake,
  Activity,
  Delete,
} from "lucide-react";
import {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  spacing,
} from "@/lib/design-system";

function useRealTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

function getGreeting(hour: number): string {
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

function formatGreetingTime(date: Date): string {
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateAge(fechaNacimiento: Date | string | null): number | null {
  if (!fechaNacimiento) return null;
  const today = new Date();
  const birth = new Date(fechaNacimiento);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function FichajePage() {
  const [dni, setDni] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [justFichado, setJustFichado] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newSocio, setNewSocio] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    planId: "",
    fechaInicio: new Date().toISOString().split("T")[0],
  });

  const now = useRealTime();
  const greeting = getGreeting(now.getHours());
  const timeString = formatGreetingTime(now);

  const { data: socio, refetch } = useSocioByDni(dni);
  const createFichaje = useCreateFichaje();
  const createSocio = useCreateSocio();
  const { data: planes } = usePlanes();

  const handleClear = useCallback(() => {
    setDni("");
    setShowCard(false);
    setNotFound(false);
    setJustFichado(false);
    setIsSearching(false);
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
    [dni]
  );

  const handleFichar = useCallback(
    async (socioId?: string) => {
      const id = socioId || socio?.id;
      if (!id) return;
      try {
        await createFichaje.mutateAsync(id);
        setJustFichado(true);
        setTimeout(() => handleClear(), 2500);
      } catch {
        // silent
      }
    },
    [socio?.id, createFichaje, handleClear]
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
    } else if (result.isError) {
      setNotFound(true);
      setShowCard(false);
    }
  }, [dni, refetch, handleFichar]);

  const handleRegister = async () => {
    if (!newSocio.nombre || !newSocio.apellido || !newSocio.dni || !newSocio.planId) return;
    try {
      await createSocio.mutateAsync(newSocio);
      setShowRegisterModal(false);
      const registeredDni = newSocio.dni;
      setNewSocio({ nombre: "", apellido: "", dni: "", planId: "", fechaInicio: new Date().toISOString().split("T")[0] });
      setDni(registeredDni);
    } catch {
      // silent
    }
  };

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  // Animation state for buttons
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8"
      style={{ background: colors.bgBase, boxSizing: "border-box" }}
    >
      {/* Main container - separated layout */}
      <div className="flex flex-col gap-8" style={{ width: "100%", maxWidth: 420 }}>

        {/* Greeting / Clock Header - Now isolated from keypad */}
        <div className="px-2">
          <div className="flex items-baseline gap-3 mb-1">
            <p
              style={{
                fontFamily: fontFamily.dmSans,
                fontSize: 15,
                fontWeight: 500,
                color: colors.textSecondary,
                lineHeight: 1.4,
              }}
            >
              {greeting}
            </p>
          </div>
          
          {/* Clock with tabular-nums to prevent layout shift */}
          <div
            className="relative"
            style={{
              background: colors.bgSurface,
              borderRadius: 16,
              padding: "20px 24px",
              border: `1px solid ${colors.border}`,
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            {/* Decorative accent line */}
            <div
              className="absolute top-0 left-0 h-1 rounded-t-2xl"
              style={{
                background: `linear-gradient(90deg, ${colors.accent}, transparent)`,
                width: "40%",
              }}
            />
            
            <p
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: 52,
                fontWeight: 700,
                color: colors.textPrimary,
                lineHeight: 1,
                letterSpacing: "0.02em",
                fontVariantNumeric: "tabular-nums",
                textAlign: "center",
              }}
            >
              {timeString}
            </p>
            <p
              style={{
                fontFamily: fontFamily.dmSans,
                fontSize: 13,
                color: colors.textSecondary,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Not Found */}
        {notFound && (
          <div
            className="rounded-2xl p-6 text-center border"
            style={{
              background: colors.bgSurface,
              borderColor: "rgba(239,68,68,0.3)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            }}
          >
            <AlertCircle
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: colors.danger }}
            />
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: colors.danger, fontFamily: fontFamily.dmSans }}
            >
              Socio no encontrado
            </h3>
            <p
              className="mb-4"
              style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans, fontSize: fontSize.sm }}
            >
              No existe un socio registrado con este DNI
            </p>
            <button
              onClick={() => {
                setShowRegisterModal(true);
                setNewSocio((prev) => ({ ...prev, dni }));
              }}
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{ 
                background: colors.accent, 
                color: "white", 
                fontFamily: fontFamily.dmSans,
                boxShadow: `0 4px 12px rgba(124, 111, 205, 0.3)`,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)")}
            >
              Registrar nuevo socio
            </button>
          </div>
        )}

        {/* Member Card */}
        {showCard && socio && (
          <div
            className="rounded-2xl p-6 border animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ 
              background: colors.bgSurface, 
              borderColor: colors.border,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {justFichado ? (
              <div className="text-center py-8">
                <div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ 
                    background: colors.successBg,
                    boxShadow: `0 0 40px rgba(46, 204, 143, 0.3)`,
                  }}
                >
                  <Check className="w-10 h-10" style={{ color: colors.success }} />
                </div>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: colors.success, fontFamily: fontFamily.syne }}
                >
                  ¡Fichado!
                </h3>
                <p
                  className="font-medium text-lg"
                  style={{ color: colors.textPrimary, fontFamily: fontFamily.dmSans }}
                >
                  Bienvenido/a {socio.nombre}
                </p>
                <p style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans, marginTop: spacing[2] }}>
                  {formatTime(new Date())}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${colors.accent}, #6D28D9)` }}
                  >
                    {socio.nombre[0]}
                    {socio.apellido[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2
                      className="text-xl font-bold truncate"
                      style={{ fontFamily: fontFamily.syne }}
                    >
                      {socio.nombre} {socio.apellido}
                    </h2>
                    <p
                      style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans, fontSize: fontSize.sm }}
                    >
                      DNI {socio.dni}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-sm font-semibold shrink-0"
                    style={
                      socio.tieneDeuda
                        ? { background: "rgba(245,158,11,0.15)", color: colors.amber }
                        : { background: colors.successBg, color: colors.success }
                    }
                  >
                    {socio.tieneDeuda ? "DEBE" : "AL DÍA"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div
                    className="p-4 rounded-xl border"
                    style={{
                      background: `${colors.accent}14`,
                      borderColor: `${colors.accent}33`,
                    }}
                  >
                    <div
                      className="flex items-center gap-2 text-xs mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      <Sparkles className="w-3 h-3" style={{ color: colors.accent }} /> Plan
                    </div>
                    <p
                      className="font-bold"
                      style={{ color: colors.accent, fontFamily: fontFamily.dmSans }}
                    >
                      {socio.plan.nombre}
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-xl border"
                    style={{ background: colors.bgElevated, borderColor: colors.border }}
                  >
                    <div
                      className="flex items-center gap-2 text-xs mb-1"
                      style={{ color: colors.textSecondary }}
                    >
                      <Activity className="w-3 h-3" /> Visitas
                    </div>
                    <p className="font-bold" style={{ fontFamily: fontFamily.dmSans }}>
                      {socio.visitasMesActual || 0} este mes
                    </p>
                  </div>
                  {socio.fechaNacimiento && (
                    <div
                      className="p-4 rounded-xl border"
                      style={{ background: colors.bgElevated, borderColor: colors.border }}
                    >
                      <div
                        className="flex items-center gap-2 text-xs mb-1"
                        style={{ color: colors.textSecondary }}
                      >
                        <Cake className="w-3 h-3" /> Edad
                      </div>
                      <p className="font-bold" style={{ fontFamily: fontFamily.dmSans }}>
                        {calculateAge(socio.fechaNacimiento)} años
                      </p>
                    </div>
                  )}
                  {socio.telefono && (
                    <div
                      className="p-4 rounded-xl border"
                      style={{ background: colors.bgElevated, borderColor: colors.border }}
                    >
                      <div
                        className="flex items-center gap-2 text-xs mb-1"
                        style={{ color: colors.textSecondary }}
                      >
                        <Phone className="w-3 h-3" /> Teléfono
                      </div>
                      <p
                        className="font-bold text-sm"
                        style={{ fontFamily: fontFamily.dmSans }}
                      >
                        {socio.telefono}
                      </p>
                    </div>
                  )}
                </div>

                {isSearching && (
                  <div
                    className="flex items-center justify-center gap-2 py-3"
                    style={{ color: colors.textSecondary }}
                  >
                    <div
                      className="w-4 h-4 border-2 rounded-full animate-spin"
                      style={{
                        borderColor: colors.accent,
                        borderTopColor: "transparent",
                      }}
                    />
                    <span style={{ fontFamily: fontFamily.dmSans, fontSize: fontSize.sm }}>
                      Registrando entrada...
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Keypad - Now clearly separated from clock */}
        {!showCard && !notFound && (
          <div
            className="rounded-2xl p-6 border"
            style={{ 
              background: colors.bgSurface, 
              borderColor: colors.border,
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            <div className="text-center mb-5">
              <div
                className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center"
                style={{ background: colors.accentBg }}
              >
                <User className="w-7 h-7" style={{ color: colors.accent }} />
              </div>
              <h2 className="text-lg font-semibold" style={{ fontFamily: fontFamily.dmSans }}>
                Ingresá tu DNI
              </h2>
              <p
                className="text-xs mt-1"
                style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans }}
              >
                Tocá los números
              </p>
            </div>

            {/* DNI Display */}
            <div
              className="relative rounded-xl p-4 mb-5 border"
              style={{ background: colors.bgElevated, borderColor: colors.border }}
            >
              <div className="flex items-center justify-center min-h-[64px]">
                <span
                  className="text-4xl font-bold tracking-wider"
                  style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    color: dni ? colors.textPrimary : colors.textSecondary,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.2em",
                  }}
                >
                  {dni ? dni.padEnd(8, "•") : "••••••••"}
                </span>
              </div>
              {dni && (
                <button
                  onClick={handleBackspace}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-150"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = colors.bgSurface;
                    (e.currentTarget as HTMLButtonElement).style.color = colors.danger;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = colors.textSecondary;
                  }}
                >
                  <Delete className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleDigit(num)}
                  disabled={dni.length >= 12}
                  className="aspect-square rounded-2xl font-bold text-2xl border transition-all duration-150"
                  style={{
                    background: pressedKey === num ? colors.accentBg : colors.bgElevated,
                    borderColor: pressedKey === num ? colors.borderAccent : colors.border,
                    color: colors.textPrimary,
                    fontFamily: fontFamily.syne,
                    transform: pressedKey === num ? "scale(0.95)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (pressedKey !== num) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = colors.borderAccent;
                      (e.currentTarget as HTMLButtonElement).style.background = colors.bgSurface;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pressedKey !== num) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border;
                      (e.currentTarget as HTMLButtonElement).style.background = colors.bgElevated;
                    }
                  }}
                  onMouseDown={() => setPressedKey(num)}
                  onMouseUp={() => setPressedKey(null)}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div />
              <button
                onClick={() => handleDigit("0")}
                disabled={dni.length >= 12}
                className="aspect-square rounded-2xl font-bold text-2xl border transition-all duration-150"
                style={{
                  background: pressedKey === "0" ? colors.accentBg : colors.bgElevated,
                  borderColor: pressedKey === "0" ? colors.borderAccent : colors.border,
                  color: colors.textPrimary,
                  fontFamily: fontFamily.syne,
                  transform: pressedKey === "0" ? "scale(0.95)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (pressedKey !== "0") {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = colors.borderAccent;
                    (e.currentTarget as HTMLButtonElement).style.background = colors.bgSurface;
                  }
                }}
                onMouseLeave={(e) => {
                  if (pressedKey !== "0") {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border;
                    (e.currentTarget as HTMLButtonElement).style.background = colors.bgElevated;
                  }
                }}
                onMouseDown={() => setPressedKey("0")}
                onMouseUp={() => setPressedKey(null)}
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                disabled={!dni}
                className="aspect-square rounded-xl border flex items-center justify-center transition-all duration-150"
                style={{
                  background: colors.bgElevated,
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(232,81,74,0.5)";
                  (e.currentTarget as HTMLButtonElement).style.color = colors.danger;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border;
                  (e.currentTarget as HTMLButtonElement).style.color = colors.textSecondary;
                }}
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSearch}
              disabled={dni.length < 6}
              className="w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ 
                background: dni.length >= 6 ? colors.accent : colors.bgElevated, 
                color: dni.length >= 6 ? "white" : colors.textSecondary, 
                fontFamily: fontFamily.dmSans,
                boxShadow: dni.length >= 6 ? `0 4px 16px rgba(124, 111, 205, 0.4)` : "none",
              }}
              onMouseEnter={(e) => {
                if (dni.length >= 6) {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(124, 111, 205, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = dni.length >= 6 ? "0 4px 16px rgba(124, 111, 205, 0.4)" : "none";
              }}
            >
              <span>Buscar socio</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {dni && (
              <button
                onClick={handleClear}
                className="w-full mt-3 py-2 text-sm text-center transition-colors"
                style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = colors.textPrimary)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = colors.textSecondary)}
              >
                Limpiar todo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-md border"
            style={{ 
              background: colors.bgSurface, 
              borderColor: colors.border,
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ fontFamily: fontFamily.syne }}>
                Registrar Nuevo Socio
              </h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = colors.bgElevated;
                  (e.currentTarget as HTMLButtonElement).style.color = colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = colors.textSecondary;
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans }}
                >
                  DNI
                </label>
                <input
                  type="text"
                  value={newSocio.dni}
                  onChange={(e) =>
                    setNewSocio((prev) => ({ ...prev, dni: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border text-base"
                  style={{
                    background: colors.bgElevated,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    fontFamily: fontFamily.dmSans,
                  }}
                  placeholder="12345678"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm mb-1"
                    style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans }}
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={newSocio.nombre}
                    onChange={(e) =>
                      setNewSocio((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border text-base"
                    style={{
                      background: colors.bgElevated,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      fontFamily: fontFamily.dmSans,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm mb-1"
                    style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans }}
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={newSocio.apellido}
                    onChange={(e) =>
                      setNewSocio((prev) => ({ ...prev, apellido: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border text-base"
                    style={{
                      background: colors.bgElevated,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      fontFamily: fontFamily.dmSans,
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm mb-1"
                  style={{ color: colors.textSecondary, fontFamily: fontFamily.dmSans }}
                >
                  Plan
                </label>
                <select
                  value={newSocio.planId}
                  onChange={(e) =>
                    setNewSocio((prev) => ({ ...prev, planId: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border text-base"
                  style={{
                    background: colors.bgElevated,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                    fontFamily: fontFamily.dmSans,
                  }}
                >
                  <option value="">Seleccionar plan...</option>
                  {planes?.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.nombre} - ${plan.precio}/mes
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-3 rounded-xl border font-medium transition-colors"
                  style={{ borderColor: colors.border, color: colors.textPrimary, fontFamily: fontFamily.dmSans }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = colors.bgElevated;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRegister}
                  className="flex-1 py-3 rounded-xl font-medium text-white transition-all duration-200"
                  style={{ 
                    background: colors.accent, 
                    fontFamily: fontFamily.dmSans,
                    boxShadow: `0 4px 12px rgba(124, 111, 205, 0.3)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 16px rgba(124, 111, 205, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(124, 111, 205, 0.3)";
                  }}
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
