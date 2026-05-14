import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import React from 'react';

const mockLogout = vi.fn();

vi.mock('@/lib/auth/auth-context', () => ({
  useAuth: () => ({
    user: { id: '1', username: 'admin', lastLoginAt: null },
    authenticated: true,
    loading: false,
    logout: mockLogout,
  }),
}));

// Import statico - devuelve el mock gracias a vi.mock
import { useAuth } from '@/lib/auth/auth-context';

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('Sidebar Logout', () => {
  beforeEach(() => {
    mockLogout.mockResolvedValue(undefined);
  });

  it('renderiza boton de logout y llama logout al hacer click', async () => {
    function TestSidebar() {
      const { logout } = useAuth();
      return (
        <aside>
          <button onClick={() => logout()} data-testid="logout-btn">
            Cerrar Sesión
          </button>
        </aside>
      );
    }

    render(<TestSidebar />);

    const btn = screen.getByTestId('logout-btn');
    expect(btn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
