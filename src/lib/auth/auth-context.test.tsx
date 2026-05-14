import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import React from 'react';

const mockFetch = vi.fn();
global.fetch = mockFetch;

import { useAuth, AuthProvider } from '@/lib/auth/auth-context';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  mockFetch.mockReset();
});

describe('AuthContext', () => {
  it('tira error cuando useAuth se usa fuera de AuthProvider', () => {
    function BadComponent() {
      useAuth();
      return null;
    }

    expect(() => render(<BadComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });

  it('logout hace fetch POST a /api/auth/logout y redirige', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Sesión cerrada correctamente' }),
    });

    // Interceptar window.location.href
    let capturedHref = '';
    const locationMock = {
      get href() { return capturedHref; },
      set href(val: string) { capturedHref = val; },
      assign: vi.fn(),
      reload: vi.fn(),
      replace: vi.fn(),
    };
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true,
      configurable: true,
    });

    function TestConsumer() {
      const { logout } = useAuth();
      return (
        <button data-testid="logout-btn" onClick={() => logout()}>
          Logout
        </button>
      );
    }

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Esperar que inicialice (trae session)
    await waitFor(() => {
      expect(mockFetch.mock.calls.some(([u]) => u.includes('/api/auth/session'))).toBe(true);
    });

    // Click logout
    await act(async () => {
      fireEvent.click(screen.getByTestId('logout-btn'));
    });

    // Verificar que se llamó POST /api/auth/logout
    await waitFor(() => {
      const logoutCalls = mockFetch.mock.calls.filter(
        (call: any[]) =>
          (call[0] as string).includes('/api/auth/logout') && (call[1] as any)?.method === 'POST'
      );
      expect(logoutCalls.length).toBeGreaterThanOrEqual(1);
    });

    // Verificar redirect
    expect(capturedHref).toContain('/login');
  });
});
