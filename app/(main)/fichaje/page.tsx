"use client";

import { useState, useCallback } from "react";
import { useSocioByDni, useCreateSocio } from "@/hooks/useSocios";
import { useCreateFichaje, useFichajes } from "@/hooks/useFichajes";
import { usePlanes } from "@/hooks/usePlanes";
import { User, Clock, AlertCircle, Check, X, ArrowRight, Calendar, Sparkles, Phone, Cake, Activity, Delete } from "lucide-react";

export default function FichajePage() {
  const [dni, setDni] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [justFichado, setJustFichado] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data: socio, refetch } = useSocioByDni(dni);
  const { data: fichajes } = useFichajes(true);
  const createFichaje = useCreateFichaje();
  const createSocio = useCreateSocio();
  const { data: planes } = usePlanes();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newSocio, setNewSocio] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    planId: "",
    fechaInicio: new Date().toISOString().split("T")[0],
  });

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

  const handleDigit = useCallback((digit: string) => {
    if (dni.length < 12) {
      setDni((prev) => prev + digit);
    }
  }, [dni]);

  const handleFichar = useCallback(async (socioId?: string) => {
    const id = socioId || socio?.id;
    if (!id) return;

    try {
      await createFichaje.mutateAsync(id);
      setJustFichado(true);

      setTimeout(() => {
        handleClear();
      }, 2500);
    } catch {
      // Error silently handled
    }
  }, [socio?.id, createFichaje, handleClear]);

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

      setTimeout(() => {
        handleFichar(result.data.id);
      }, 3000);
    } else if (result.isError) {
      setNotFound(true);
      setShowCard(false);
    }
  }, [dni, refetch, handleFichar]);

  const handleRegister = async () => {
    if (!newSocio.nombre || !newSocio.apellido || !newSocio.dni || !newSocio.planId) {
      return;
    }

    try {
      await createSocio.mutateAsync(newSocio);
      setShowRegisterModal(false);
      const registeredDni = newSocio.dni;
      setNewSocio({
        nombre: "",
        apellido: "",
        dni: "",
        planId: "",
        fechaInicio: new Date().toISOString().split("T")[0],
      });
      setDni(registeredDni);
    } catch {
      // Error silently handled
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateAge = (fechaNacimiento: Date | string | null) => {
    if (!fechaNacimiento) return null;
    const today = new Date();
    const birth = new Date(fechaNacimiento);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 max-w-[1400px]">

        {/* Header */}
        <header className="mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Panel de Fichaje
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            {getGreeting()} — Ingresá tu DNI para registrar tu entrada
          </p>
        </header>

        {/* Main layout: left input panel + right check-ins panel */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left - Input Area */}
          <div className="flex-1 min-w-0">
            {/* Not Found */}
            {notFound && (
              <div
                className="rounded-2xl p-6 mb-6 text-center border"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                }}
              >
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                <h3 className="text-lg font-semibold text-red-300 mb-2">Socio no encontrado</h3>
                <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                  No existe un socio registrado con este DNI
                </p>
                <button
                  onClick={() => {
                    setShowRegisterModal(true);
                    setNewSocio((prev) => ({ ...prev, dni }));
                  }}
                  className="px-6 py-3 rounded-xl font-medium text-white transition-colors"
                  style={{ background: "var(--accent)" }}
                >
                  Registrar nuevo socio
                </button>
              </div>
            )}

            {/* Member Card */}
            {showCard && socio && (
              <div
                className="rounded-2xl p-6 mb-6 border animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                {justFichado ? (
                  <div className="text-center py-10">
                    <div
                      className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(16, 185, 129, 0.15)" }}
                    >
                      <Check className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-300 mb-2">¡Fichado!</h3>
                    <p className="font-medium">Bienvenido/a {socio.nombre}</p>
                    <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
                      {formatTime(new Date())}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                        style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
                      >
                        {socio.nombre[0]}{socio.apellido[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold truncate">
                          {socio.nombre} {socio.apellido}
                        </h2>
                        <p className="font-mono" style={{ color: "var(--text-secondary)" }}>
                          DNI {socio.dni}
                        </p>
                      </div>
                      <div
                        className="px-3 py-1 rounded-full text-sm font-semibold shrink-0"
                        style={
                          socio.tieneDeuda
                            ? { background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }
                            : { background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }
                        }
                      >
                        {socio.tieneDeuda ? "DEBE" : "AL DÍA"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div
                        className="p-4 rounded-xl border"
                        style={{ background: "rgba(124, 58, 237, 0.08)", borderColor: "rgba(124, 58, 237, 0.2)" }}
                      >
                        <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                          <Sparkles className="w-3 h-3 text-violet-400" /> Plan
                        </div>
                        <p className="font-bold text-violet-300">{socio.plan.nombre}</p>
                      </div>
                      <div
                        className="p-4 rounded-xl border"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                      >
                        <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                          <Activity className="w-3 h-3" /> Visitas
                        </div>
                        <p className="font-bold">{socio.visitasMesActual || 0} este mes</p>
                      </div>
                      {socio.fechaNacimiento && (
                        <div
                          className="p-4 rounded-xl border"
                          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                        >
                          <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                            <Cake className="w-3 h-3" /> Edad
                          </div>
                          <p className="font-bold">{calculateAge(socio.fechaNacimiento)} años</p>
                        </div>
                      )}
                      {socio.telefono && (
                        <div
                          className="p-4 rounded-xl border"
                          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                        >
                          <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                            <Phone className="w-3 h-3" /> Teléfono
                          </div>
                          <p className="font-bold text-sm">{socio.telefono}</p>
                        </div>
                      )}
                    </div>

                    {isSearching && (
                      <div className="flex items-center justify-center gap-2 py-3" style={{ color: "var(--text-secondary)" }}>
                        <div
                          className="w-4 h-4 border-2 rounded-full animate-spin"
                          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
                        />
                        <span>Registrando entrada...</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Keypad Card */}
            {!showCard && !notFound && (
              <div
                className="rounded-2xl p-5 border w-full max-w-sm"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="text-center mb-4">
                  <div
                    className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(124, 58, 237, 0.15)" }}
                  >
                    <User className="w-6 h-6 text-violet-400" />
                  </div>
                  <h2 className="text-base font-semibold">Ingresá tu DNI</h2>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Tocá los números
                  </p>
                </div>

                {/* DNI Display */}
                <div
                  className="relative rounded-xl p-3 mb-4 border"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-center min-h-[48px]">
                    <span
                      className="text-3xl font-bold font-mono tracking-[0.2em]"
                      style={{ color: dni ? "var(--text-primary)" : "var(--text-secondary)" }}
                    >
                      {dni || "--------"}
                    </span>
                  </div>
                  {dni && (
                    <button
                      onClick={handleBackspace}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleDigit(num)}
                      disabled={dni.length >= 12}
                      className="aspect-square rounded-lg border font-bold text-xl transition-all duration-150"
                      style={{
                        background: "var(--bg-secondary)",
                        borderColor: "var(--border)",
                        color: "var(--text-primary)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Bottom row: 0 + backspace */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div />
                  <button
                    onClick={() => handleDigit("0")}
                    disabled={dni.length >= 12}
                    className="aspect-square rounded-lg border font-bold text-xl transition-all duration-150"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    0
                  </button>
                  <button
                    onClick={handleBackspace}
                    disabled={!dni}
                    className="aspect-square rounded-lg border flex items-center justify-center transition-all duration-150"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: "var(--border)",
                      color: "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={dni.length < 6}
                  className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  <span>Buscar socio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleClear}
                  className="w-full mt-2 py-2 text-center text-xs transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Limpiar todo
                </button>
              </div>
            )}
          </div>

          {/* Right - Today's Check-ins */}
          <div className="lg:w-[380px] shrink-0">
            <div
              className="rounded-2xl p-6 border sticky top-6"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(124, 58, 237, 0.15)" }}
                >
                  <Calendar className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Fichajes de hoy</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {fichajes?.length || 0} registros
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto">
                {fichajes && fichajes.length > 0 ? (
                  fichajes.slice(0, 15).map((fichaje) => (
                    <div
                      key={fichaje.id}
                      className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
                      >
                        {fichaje.socio.nombre[0]}{fichaje.socio.apellido[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {fichaje.socio.nombre} {fichaje.socio.apellido}
                        </p>
                        <p
                          className="text-xs flex items-center gap-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <Clock className="w-3 h-3" />
                          {formatTime(fichaje.fechaHora)}
                        </p>
                      </div>
                      <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10" style={{ color: "var(--text-secondary)" }}>
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No hay fichajes aún</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div
            className="rounded-2xl p-6 w-full max-w-md border"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Registrar Nuevo Socio</h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                  DNI
                </label>
                <input
                  type="text"
                  value={newSocio.dni}
                  onChange={(e) => setNewSocio((prev) => ({ ...prev, dni: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-base"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="12345678"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={newSocio.nombre}
                    onChange={(e) => setNewSocio((prev) => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-base"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={newSocio.apellido}
                    onChange={(e) => setNewSocio((prev) => ({ ...prev, apellido: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-base"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
                  Plan
                </label>
                <select
                  value={newSocio.planId}
                  onChange={(e) => setNewSocio((prev) => ({ ...prev, planId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-base"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
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
                  style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRegister}
                  className="flex-1 py-3 rounded-xl font-medium text-white transition-colors"
                  style={{ background: "var(--accent)" }}
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
