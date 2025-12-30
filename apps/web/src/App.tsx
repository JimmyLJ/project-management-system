import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ForgotPasswordPage } from './components/forgot-password-page'
import { LoginPage } from './components/login-page'
import { RegisterPage } from './components/register-page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
