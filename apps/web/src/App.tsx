import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './components/dashboard-page'
import { ForgotPasswordPage } from './components/forgot-password-page'
import { LoginPage } from './components/login-page'
import { RegisterPage } from './components/register-page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    let active = true

    const verify = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          { credentials: 'include' },
        )
        if (!active) return
        setIsAuthed(response.ok)
      } catch {
        if (!active) return
        setIsAuthed(false)
      } finally {
        if (!active) return
        setIsChecking(false)
      }
    }

    verify()

    return () => {
      active = false
    }
  }, [])

  if (isChecking) {
    return (
      <div className="flex min-h-screen min-h-[100svh] items-center justify-center text-sm text-[#596172]">
        正在验证登录状态...
      </div>
    )
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
