import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { AdminApp } from './pages/admin/AdminApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 主应用 */}
          <Route path="/*" element={<App />} />

          {/* 管理后台 */}
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
