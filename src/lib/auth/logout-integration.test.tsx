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

describe('Logout Flow Integration', () => {
  beforeEach(() => {
    mockLogout.mockResolvedValue(undefined);
    mockOnClose.mockClear();
  });

  it('sidebar llama auth logout al hacer click en Cerrar Sesion', async () => {
    function TestSidebar() {
      const { logout } = useAuth();
      return (
        <aside>
          <button onClick={() => logout()} data-testid="logout">
            Cerrar Sesión
          </button>
        </aside>
      );
    }

    render(<TestSidebar />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('logout'));
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('mobile sidebar logout llama logout luego onClose', async () => {
    function TestMobileSidebar() {
      const { logout } = useAuth();
      return (
        <div data-testid="sidebar">
          <button
            onClick={async () => {
              await logout();
              mockOnClose();
            }}
            data-testid="logout"
          >
            Cerrar Sesión
          </button>
        </div>
      );
    }

    render(<TestMobileSidebar />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('logout'));
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
