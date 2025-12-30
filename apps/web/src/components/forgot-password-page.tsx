import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen min-h-[100svh] w-full items-center justify-center overflow-x-hidden bg-[radial-gradient(circle_at_10%_20%,#f7f0e8_0%,#f2efe9_35%,#f6f7f4_100%)] px-[6vw] py-[clamp(2rem,5vh,3.5rem)] text-[#0b0d12]">
      <motion.section
        className="w-full max-w-[460px] rounded-[2rem] border border-black/5 bg-white p-12 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      >
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1c7c8c]">
            重置密码
          </p>
          <h2 className="text-3xl font-semibold text-[#0b0d12]">
            找回你的账号
          </h2>
          <p className="text-sm text-[#596172]">
            输入注册邮箱，我们会发送重置链接。
            <Button
              asChild
              variant="link"
              className="h-auto p-0 pl-2 text-sm font-semibold text-[#1c7c8c]"
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
            <Label htmlFor="email" className="text-sm font-semibold text-[#1c2333]">
              邮箱地址
            </Label>
            <div className="flex items-center gap-2 rounded-[0.9rem] border border-black/10 bg-[#f7f7f8] px-4 py-3">
              <Mail size={18} className="text-[#7b8496]" />
              <Input
                id="email"
                type="email"
                placeholder="you@team.com"
                className="h-auto border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>

          <Button className="h-12 w-full rounded-full bg-gradient-to-r from-[#ff6a3d] to-[#ff9a5f] text-base font-bold text-[#151515] shadow-[0_10px_30px_rgba(255,106,61,0.35)] hover:opacity-90">
            发送重置链接
          </Button>
        </form>
      </motion.section>
    </div>
  )
}
