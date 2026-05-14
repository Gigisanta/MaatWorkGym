import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', () => ({
  motion: { div: 'div', button: 'button', span: 'span' },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

const mockUseEmpleados = vi.fn();
const mockUseEmpleadoFichajes = vi.fn();
const mockUseCreateFichaje = vi.fn();
const mockUseEmpleadoByDni = vi.fn();

vi.mock('@/hooks/useEmpleadoFichajes', () => ({
  useEmpleados: () => mockUseEmpleados(),
  useEmpleadoFichajes: () => mockUseEmpleadoFichajes(),
  useCreateFichaje: () => mockUseCreateFichaje(),
  useEmpleadoByDni: () => mockUseEmpleadoByDni(),
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

import EmpleadosPage from './page';

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

const mockEmpleados = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Perez',
    cargo: 'Recepcionista',
    dni: '12345678',
    horarioEntrada: '08:00',
    horarioSalida: '17:00',
    activo: true,
  },
  {
    id: '2',
    nombre: 'Ana',
    apellido: 'Gomez',
    cargo: 'Instructor',
    dni: '87654321',
    horarioEntrada: '06:00',
    horarioSalida: '15:00',
    activo: true,
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'Ruiz',
    cargo: 'Limpieza',
    dni: '11222333',
    horarioEntrada: '09:00',
    horarioSalida: '18:00',
    activo: false,
  },
];

const mockFichajes = [
  {
    id: 'f1',
    empleadoId: '1',
    tipo: 'entrada',
    fechaHora: new Date(),
    notas: null,
    socioId: null,
  },
  {
    id: 'f2',
    empleadoId: '2',
    tipo: 'entrada',
    fechaHora: new Date(),
    notas: null,
    socioId: null,
  },
  {
    id: 'f3',
    empleadoId: '2',
    tipo: 'salida',
    fechaHora: new Date(),
    notas: null,
    socioId: null,
  },
];

describe('EmpleadosPage', () => {
  beforeEach(() => {
    mockUseEmpleados.mockReturnValue({ data: mockEmpleados, isLoading: false });
    mockUseEmpleadoFichajes.mockReturnValue({ data: mockFichajes, isLoading: false });
    mockUseCreateFichaje.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    });
    mockUseEmpleadoByDni.mockReturnValue({ data: null, refetch: vi.fn() });
  });

  it('muestra estado de carga cuando isLoading=true', () => {
    mockUseEmpleados.mockReturnValue({ data: null, isLoading: true });
    mockUseEmpleadoFichajes.mockReturnValue({ data: null, isLoading: true });

    render(<EmpleadosPage />);
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  it('renderiza nombres de empleados cuando se cargan los datos', async () => {
    render(<EmpleadosPage />);

    await waitFor(() => {
      expect(screen.getByText(/Juan Perez/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Ana Gomez/i)).toBeInTheDocument();
    expect(screen.getByText(/Carlos Ruiz/i)).toBeInTheDocument();
  });

  it('renderiza tabs de filtro con contadores', async () => {
    render(<EmpleadosPage />);

    // Buscar por role button - tab "En turno" (segundo boton, primero es "Todos")
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      const enTurnoBtn = buttons.find(
        (b) => b.textContent?.includes('En turno') && b.textContent?.includes('1')
      );
      expect(enTurnoBtn).toBeInTheDocument();
    });

    // Tab "Sin registrar"
    const buttons = screen.getAllByRole('button');
    const sinRegistrarBtn = buttons.find(
      (b) => b.textContent?.includes('Sin registrar') && b.textContent?.includes('1')
    );
    expect(sinRegistrarBtn).toBeInTheDocument();
  });

  it('muestra estado vacio cuando no hay empleados', async () => {
    mockUseEmpleados.mockReturnValue({ data: [], isLoading: false });

    render(<EmpleadosPage />);

    await waitFor(() => {
      expect(screen.getByText(/No hay empleados/i)).toBeInTheDocument();
    });
  });

  it('renderiza header con titulo de la seccion', async () => {
    render(<EmpleadosPage />);

    await waitFor(() => {
      expect(screen.getByText(/Control de Empleados/i)).toBeInTheDocument();
    });
  });
});
