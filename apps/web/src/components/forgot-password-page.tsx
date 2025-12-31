import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function ForgotPasswordPage() {
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
            重置密码
          </p>
          <h2 className="text-3xl font-semibold text-[#0b0d12] dark:text-slate-100">
            找回你的账号
          </h2>
          <p className="text-sm text-[#596172] dark:text-slate-400">
            输入注册邮箱，我们会发送重置链接。
            <Button
              asChild
              variant="link"
              className="h-auto p-0 pl-2 text-sm font-semibold text-[#1c7c8c] dark:text-teal-300"
            >
              <Link to="/login">返回登录</Link>
            </Button>
          </p>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-[#1c2333] dark:text-slate-200">
              邮箱地址
            </Label>
            <div className="flex items-center gap-2 rounded-[0.9rem] border border-black/10 bg-[#f7f7f8] px-4 py-3 dark:border-slate-700 dark:bg-[#0f172a]">
              <Mail size={18} className="text-[#7b8496] dark:text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@team.com"
                className="h-auto border-0 bg-transparent p-0 text-base text-[#0b0d12] focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-slate-100"
                required
              />
            </div>
          </div>

          <Button className="h-12 w-full rounded-full bg-blue-600 text-base font-semibold text-white hover:bg-blue-500">
            发送重置链接
          </Button>
        </form>
      </motion.section>
    </div>
  )
}
