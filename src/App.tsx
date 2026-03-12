import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { DetailPage } from '@/pages/DetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ErrorBoundary } from '@/components/organisms/ErrorBoundary'

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character/:id" element={<DetailPage />} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
