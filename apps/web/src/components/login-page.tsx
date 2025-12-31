import { motion } from 'framer-motion'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CreateOrganizationDialog } from './create-organization-dialog'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [needsOrganization, setNeedsOrganization] = useState(false)

  useEffect(() => {
    const shouldCheck = searchParams.get('setup') === '1'
    if (!shouldCheck) return

    let active = true

    const verifyOrganization = async () => {
      try {
        const authResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          { credentials: 'include' },
        )
        if (!active || !authResponse.ok) return

        const orgResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/orgs/mine`,
          { credentials: 'include' },
        )
        if (!active) return

        const data = (await orgResponse.json()) as { organization?: unknown }
        if (orgResponse.ok && data.organization) {
          navigate('/dashboard')
        } else {
          setNeedsOrganization(true)
        }
      } catch {
        if (!active) return
      }
    }

    verifyOrganization()

    return () => {
      active = false
    }
  }, [navigate, searchParams])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null
        setStatus('error')
        setErrorMessage(data?.message ?? '登录失败，请重试。')
        return
      }

      const orgResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/orgs/mine`,
        { credentials: 'include' },
      )

      if (orgResponse.ok) {
        const data = (await orgResponse.json()) as { organization?: unknown }
        if (data.organization) {
          navigate('/dashboard')
        } else {
          setNeedsOrganization(true)
        }
      } else {
        setNeedsOrganization(true)
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('网络异常，请检查后重试。')
    }
  }

  return (
    <div className="relative flex min-h-screen min-h-[100svh] w-full items-center justify-center overflow-x-hidden bg-[radial-gradient(circle_at_10%_20%,#f7f0e8_0%,#f2efe9_35%,#f6f7f4_100%)] px-[6vw] py-[clamp(2rem,5vh,3.5rem)] text-[#0b0d12]">
      <CreateOrganizationDialog
        open={needsOrganization}
        onCreated={() => navigate('/dashboard')}
        onClose={() => {
          setNeedsOrganization(false)
          setStatus('idle')
          setErrorMessage('')
        }}
      />
      <motion.section
        className="w-full max-w-[460px] rounded-[2rem] border border-black/5 bg-white p-12 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1c7c8c]">
            欢迎回来
          </p>
          <h2 className="text-3xl font-semibold text-[#0b0d12]">
            登录你的工作区
          </h2>
          <p className="text-sm text-[#596172]">
            新用户？
            <Button
              asChild
              variant="link"
              className="h-auto p-0 pl-2 text-sm font-semibold text-[#1c7c8c]"
            >
              <Link to="/register">注册账号</Link>
            </Button>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-[#1c2333]">
              邮箱地址
            </Label>
            <div className="flex items-center gap-2 rounded-[0.9rem] border border-black/10 bg-[#f7f7f8] px-4 py-3">
              <Mail size={18} className="text-[#7b8496]" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@team.com"
                className="h-auto border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-[#1c2333]"
            >
              密码
            </Label>
            <div className="flex items-center gap-2 rounded-[0.9rem] border border-black/10 bg-[#f7f7f8] px-4 py-3">
              <Lock size={18} className="text-[#7b8496]" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="至少 8 位字符"
                className="h-auto border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#596172]">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" defaultChecked />
              <Label htmlFor="remember" className="text-sm font-medium">
                保持登录状态
              </Label>
            </div>
            <Button
              asChild
              variant="link"
              className="h-auto p-0 text-sm font-semibold text-[#1c7c8c]"
            >
              <Link to="/forgot-password">忘记密码？</Link>
            </Button>
          </div>

          {status === 'error' ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="h-12 w-full rounded-full bg-gradient-to-r from-[#ff6a3d] to-[#ff9a5f] text-base font-bold text-[#151515] shadow-[0_10px_30px_rgba(255,106,61,0.35)] hover:opacity-90"
          >
            登录
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[#596172]">
          继续即表示你同意我们的服务条款和隐私政策。
        </p>
      </motion.section>
    </div>
  )
}
