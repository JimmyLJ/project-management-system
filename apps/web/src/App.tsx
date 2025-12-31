import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './components/dashboard-page'
import { ForgotPasswordPage } from './components/forgot-password-page'
import { LoginPage } from './components/login-page'
import { RegisterPage } from './components/register-page'

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = storedTheme
      ? storedTheme === 'dark'
      : prefersDark
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

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
  const [needsOrgSetup, setNeedsOrgSetup] = useState(false)

  useEffect(() => {
    let active = true

    const verify = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          { credentials: 'include' },
        )
        if (!active) return
        if (!response.ok) {
          setIsAuthed(false)
          setNeedsOrgSetup(false)
          return
        }

        const orgResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/orgs/mine`,
          { credentials: 'include' },
        )
        if (!active) return
        const data = (await orgResponse.json()) as { organization?: unknown }
        if (!orgResponse.ok || !data.organization) {
          setIsAuthed(false)
          setNeedsOrgSetup(true)
          return
        }

        setIsAuthed(true)
        setNeedsOrgSetup(false)
      } catch {
        if (!active) return
        setIsAuthed(false)
        setNeedsOrgSetup(false)
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
      <div className="flex min-h-screen min-h-[100svh] items-center justify-center text-sm text-[#596172] dark:bg-[#0b0f1a] dark:text-slate-400">
        正在验证登录状态...
      </div>
    )
  }

  if (!isAuthed) {
    return (
      <Navigate to={needsOrgSetup ? '/login?setup=1' : '/login'} replace />
    )
  }

  return <>{children}</>
}
