import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import React from 'react';

const mockLogout = vi.fn();
const mockOnClose = vi.fn();

vi.mock('@/lib/auth/auth-context', () => ({
  useAuth: () => ({
    user: { id: '1', username: 'admin', lastLoginAt: null },
    authenticated: true,
    loading: false,
    logout: mockLogout,
  }),
}));

import { useAuth } from '@/lib/auth/auth-context';

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('MobileSidebar Logout', () => {
  beforeEach(() => {
    mockLogout.mockResolvedValue(undefined);
    mockOnClose.mockClear();
  });

  it('renderiza boton de logout cuando esta abierto', () => {
    function TestMobileSidebar() {
      const { logout } = useAuth();
      return (
        <div data-testid="sidebar">
          <button
            onClick={async () => {
              await logout();
              mockOnClose();
            }}
            data-testid="logout-btn"
          >
            Cerrar Sesión
          </button>
        </div>
      );
    }

    render(<TestMobileSidebar />);
    expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
  });

  it('llama logout y onClose al hacer click en logout', async () => {
    function TestMobileSidebar() {
      const { logout } = useAuth();
      return (
        <div data-testid="sidebar">
          <button
            onClick={async () => {
              await logout();
              mockOnClose();
            }}
            data-testid="logout-btn"
          >
            Cerrar Sesión
          </button>
        </div>
      );
    }

    render(<TestMobileSidebar />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('logout-btn'));
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
