import { motion } from 'framer-motion'
import { Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function RegisterPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    }

    try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
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
        setErrorMessage(data?.message ?? '注册失败，请稍后再试。')
        return
      }

      navigate('/login')
    } catch (error) {
      setStatus('error')
      setErrorMessage('网络异常，请检查后重试。')
    }
  }

  return (
    <div className="relative flex min-h-screen min-h-[100svh] w-full items-center justify-center overflow-x-hidden bg-[radial-gradient(circle_at_10%_20%,#f7f0e8_0%,#f2efe9_35%,#f6f7f4_100%)] px-[6vw] py-[clamp(2rem,5vh,3.5rem)] text-[#0b0d12] dark:bg-[radial-gradient(circle_at_10%_20%,#0f172a_0%,#0b0f1a_45%,#0b0f1a_100%)] dark:text-slate-100">
      <motion.section
        className="w-full max-w-[460px] rounded-[2rem] border border-black/5 bg-white p-12 shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-[#0f172a]"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1c7c8c] dark:text-teal-300">
            创建账号
          </p>
          <h2 className="text-3xl font-semibold text-[#0b0d12] dark:text-slate-100">
            注册你的工作区
          </h2>
          <p className="text-sm text-[#596172] dark:text-slate-400">
            已有账号？
            <Button
              asChild
              variant="link"
              className="h-auto p-0 pl-2 text-sm font-semibold text-[#1c7c8c] dark:text-teal-300"
            >
              <Link to="/login">去登录</Link>
            </Button>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-[#1c2333] dark:text-slate-200">
              姓名
            </Label>
            <div className="flex items-center gap-2 rounded-[0.9rem] border border-black/10 bg-[#f7f7f8] px-4 py-3 dark:border-slate-700 dark:bg-[#0f172a]">
              <User size={18} className="text-[#7b8496] dark:text-slate-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="你的姓名"
                className="h-auto border-0 bg-transparent p-0 text-base text-[#0b0d12] focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-[#1c2333] dark:text-slate-200">
              邮箱
            </Label>
            <div className="flex items-center gap-2 rounded-[0.9rem] border border-black/10 bg-[#f7f7f8] px-4 py-3 dark:border-slate-700 dark:bg-[#0f172a]">
              <Mail size={18} className="text-[#7b8496] dark:text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@team.com"
                className="h-auto border-0 bg-transparent p-0 text-base text-[#0b0d12] focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-[#1c2333] dark:text-slate-200"
            >
              密码
            </Label>
            <div className="flex items-center gap-2 rounded-[0.9rem] border border-black/10 bg-[#f7f7f8] px-4 py-3 dark:border-slate-700 dark:bg-[#0f172a]">
              <Lock size={18} className="text-[#7b8496] dark:text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="至少 8 位字符"
                className="h-auto border-0 bg-transparent p-0 text-base text-[#0b0d12] focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-slate-100"
                required
              />
            </div>
          </div>

          {status === 'error' ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={status === 'loading'}
            className="h-12 w-full rounded-full bg-gradient-to-r from-[#ff6a3d] to-[#ff9a5f] text-base font-bold text-[#151515] shadow-[0_10px_30px_rgba(255,106,61,0.35)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            注册
          </Button>
        </form>
      </motion.section>
    </div>
  )
}
