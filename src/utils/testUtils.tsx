import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Routes, Route, type MemoryRouterProps } from 'react-router-dom'

interface WrapperOptions extends RenderOptions {
  routerProps?: MemoryRouterProps
  routePath?: string // e.g. "/character/:id"
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  })
}

export function renderWithProviders(
  ui: React.ReactElement,
  { routerProps, routePath, ...renderOptions }: WrapperOptions = {}
) {
  const queryClient = createTestQueryClient()

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          {...routerProps}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          {routePath ? (
            <Routes>
              <Route path={routePath} element={children} />
              <Route path="/not-found" element={<div>Not Found</div>} />
              <Route path="*" element={<div>Not Found</div>} />
            </Routes>
          ) : (
            children
          )}
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

export { screen, waitFor, fireEvent, act } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

// Hook test wrapper — wraps renderHook calls with QueryClient + MemoryRouter
export function createWrapper() {
  const queryClient = createTestQueryClient()

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    )
  }
}
