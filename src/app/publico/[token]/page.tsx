'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Dumbbell, Printer, Loader2 } from 'lucide-react';

const DIAS_SEMANA = [
  { num: 0, nombre: 'Lunes', abrev: 'L' },
  { num: 1, nombre: 'Martes', abrev: 'M' },
  { num: 2, nombre: 'Miércoles', abrev: 'X' },
  { num: 3, nombre: 'Jueves', abrev: 'J' },
  { num: 4, nombre: 'Viernes', abrev: 'V' },
  { num: 5, nombre: 'Sábado', abrev: 'S' },
  { num: 6, nombre: 'Domingo', abrev: 'D' },
];

interface EjercicioRutina {
  id: string;
  nombre: string;
  series: number;
  repeticiones: string;
  descanso: string;
  grupoMuscular?: string | null;
  nota?: string | null;
}

interface DiaRutina {
  id: string;
  diaSemana: number;
  nombre?: string | null;
  ejercicios: EjercicioRutina[];
}

interface Rutina {
  id: string;
  nombre: string;
  descripcion?: string | null;
  dias: DiaRutina[];
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
  comidas: Comida[];
}

interface Socio {
  id: string;
  nombre: string;
  apellido: string;
}

type TipoContenido = 'rutina' | 'rutina-generica' | 'dieta' | 'dieta-generica';

interface ContenidoPublico {
  tipo: TipoContenido;
  asignacion?: any;
  rutina?: Rutina;
  dieta?: Dieta;
  socio?: Socio;
}

export default function PublicoPage() {
  const params = useParams();
  const token = params.token as string;

  const [contenido, setContenido] = useState<ContenidoPublico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(0);

  useEffect(() => {
    async function fetchContenido() {
      try {
        const res = await fetch(`/api/publico/${token}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Contenido no encontrado');
          } else {
            setError('Error al cargar el contenido');
          }
          return;
        }
        const data = await res.json();
        setContenido(data);
      } catch {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchContenido();
    }
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#7C6FCD] mx-auto mb-4" />
          <p className="text-[#6E6D7A]">Cargando tu contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#141416] flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-10 h-10 text-[#6E6D7A]" />
          </div>
          <h1 className="text-xl font-bold text-[#F0EFF4] mb-2">Oops!</h1>
          <p className="text-[#6E6D7A]">{error}</p>
        </div>
      </div>
    );
  }

  if (!contenido) return null;

  const nombreCliente = contenido.asignacion?.socio
    ? `${contenido.asignacion.socio.nombre} ${contenido.asignacion.socio.apellido}`
    : contenido.socio
    ? `${contenido.socio.nombre} ${contenido.socio.apellido}`
    : '';

  return (
    <div className="min-h-screen bg-[#0D0D0F]">
      <header className="bg-[#141416] border-b border-[rgba(255,255,255,0.06)] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C6FCD] to-purple-600 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-[#F0EFF4]">GymPro</h1>
              {nombreCliente && (
                <p className="text-xs text-[#6E6D7A]">Hola, {nombreCliente}</p>
              )}
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7C6FCD] hover:bg-[#7C6FCD]/90 text-white text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {contenido.tipo === 'rutina' || contenido.tipo === 'rutina-generica' ? (
          <RutinaView
            rutina={contenido.tipo === 'rutina' ? contenido.asignacion.rutina : contenido.rutina}
            parametros={contenido.asignacion?.parametros}
            diaSeleccionado={diaSeleccionado}
            onDiaChange={setDiaSeleccionado}
          />
        ) : (
          <DietaView
            dieta={contenido.tipo === 'dieta' ? contenido.asignacion.dieta : contenido.dieta}
          />
        )}
      </main>
    </div>
  );
}

function RutinaView({
  rutina,
  parametros,
  diaSeleccionado,
  onDiaChange,
}: {
  rutina: Rutina;
  parametros?: any;
  diaSeleccionado: number;
  onDiaChange: (dia: number) => void;
}) {
  const diasOrdenados = [...rutina.dias].sort((a, b) => a.diaSemana - b.diaSemana);
  const diaActual = rutina.dias.find(d => d.diaSemana === diaSeleccionado) || diasOrdenados[0];

  const getParamValue = (ejercicioId: string, field: string, defaultValue: any) => {
    return parametros?.[ejercicioId]?.[field] ?? defaultValue;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#F0EFF4] mb-1">{rutina.nombre}</h2>
        {rutina.descripcion && (
          <p className="text-[#6E6D7A]">{rutina.descripcion}</p>
        )}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {diasOrdenados.map((dia) => {
          const infoDia = DIAS_SEMANA.find(d => d.num === dia.diaSemana);
          return (
            <button
              key={dia.id}
              onClick={() => onDiaChange(dia.diaSemana)}
              className={`min-w-[48px] h-12 rounded-xl font-medium transition-colors ${
                diaActual?.id === dia.id
                  ? 'bg-[#7C6FCD] text-white'
                  : 'bg-[#141416] text-[#6E6D7A] hover:bg-[#1C1C1F]'
              }`}
            >
              <div className="text-sm">{infoDia?.abrev}</div>
              <div className="text-xs opacity-80">{dia.ejercicios.length}</div>
            </button>
          );
        })}
      </div>

      {diaActual && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#F0EFF4]">
              {DIAS_SEMANA.find(d => d.num === diaActual.diaSemana)?.nombre}
              {diaActual.nombre && ` - ${diaActual.nombre}`}
            </h3>
            <span className="text-sm text-[#6E6D7A]">
              {diaActual.ejercicios.length} ejercicio{diaActual.ejercicios.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {diaActual.ejercicios.map((ejercicio, idx) => {
              const series = getParamValue(ejercicio.id, 'series', ejercicio.series);
              const repeticiones = getParamValue(ejercicio.id, 'repeticiones', ejercicio.repeticiones);
              const descanso = getParamValue(ejercicio.id, 'descanso', ejercicio.descanso);

              return (
                <div
                  key={ejercicio.id}
                  className="p-4 rounded-xl bg-[#141416] border border-[rgba(255,255,255,0.06)]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#F0EFF4]">{ejercicio.nombre}</h4>
                      {ejercicio.grupoMuscular && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#7C6FCD]/20 text-[#7C6FCD]">
                          {ejercicio.grupoMuscular}
                        </span>
                      )}
                    </div>
                    <span className="text-2xl font-bold text-[#7C6FCD]">{idx + 1}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-[#1C1C1F]">
                      <div className="text-xs text-[#6E6D7A] mb-1">Series</div>
                      <div className="font-bold text-[#F0EFF4]">{series}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[#1C1C1F]">
                      <div className="text-xs text-[#6E6D7A] mb-1">Reps</div>
                      <div className="font-bold text-[#F0EFF4]">{repeticiones}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[#1C1C1F]">
                      <div className="text-xs text-[#6E6D7A] mb-1">Descanso</div>
                      <div className="font-bold text-[#F0EFF4]">{descanso}</div>
                    </div>
                  </div>
                  {ejercicio.nota && (
                    <p className="mt-3 text-sm text-[#6E6D7A] italic">{ejercicio.nota}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DietaView({ dieta }: { dieta: Dieta }) {
  const comidasOrdenadas = [...dieta.comidas].sort((a, b) => a.hora.localeCompare(b.hora));

  const calcularTotales = (items: ItemComida[]) => {
    return items.reduce(
      (acc, item) => ({
        proteinas: acc.proteinas + (item.proteinas || 0),
        carbohidratos: acc.carbohidratos + (item.carbohidratos || 0),
        grasas: acc.grasas + (item.grasas || 0),
      }),
      { proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#F0EFF4] mb-1">{dieta.nombre}</h2>
        {dieta.descripcion && (
          <p className="text-[#6E6D7A]">{dieta.descripcion}</p>
        )}
      </div>

      <div className="space-y-6">
        {comidasOrdenadas.map((comida) => {
          const totales = calcularTotales(comida.items);
          return (
            <div
              key={comida.id}
              className="p-4 rounded-xl bg-[#141416] border border-[rgba(255,255,255,0.06)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg bg-[#7C6FCD] text-white text-sm font-medium">
                    {comida.hora}
                  </span>
                  <h3 className="font-semibold text-[#F0EFF4]">{comida.nombre}</h3>
                </div>
                <span className="text-sm text-[#6E6D7A]">
                  {totales.proteinas.toFixed(1)}P / {totales.carbohidratos.toFixed(1)}C / {totales.grasas.toFixed(1)}G
                </span>
              </div>

              <div className="space-y-2">
                {comida.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#1C1C1F]"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-[#F0EFF4]">{item.alimento}</span>
                      <span className="text-sm text-[#6E6D7A] ml-2">{item.cantidad}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-[#6E6D7A]">
                      {item.proteinas !== null && <span>P: {item.proteinas}g</span>}
                      {item.carbohidratos !== null && <span>C: {item.carbohidratos}g</span>}
                      {item.grasas !== null && <span>G: {item.grasas}g</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}