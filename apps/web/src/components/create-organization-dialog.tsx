import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

type CreateOrganizationDialogProps = {
  open: boolean
  onCreated: () => void
  onClose: () => void
}

export function CreateOrganizationDialog({
  open,
  onCreated,
  onClose,
}: CreateOrganizationDialogProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [logoError, setLogoError] = useState('')
  const logoInputRef = useRef<HTMLInputElement | null>(null)

  if (!open) return null

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setLogoPreview(null)
      setLogoFile(null)
      setLogoError('')
      return
    }

    const allowedTypes = ['image/png', 'image/jpeg']
    if (!allowedTypes.includes(file.type)) {
      event.target.value = ''
      setLogoPreview(null)
      setLogoFile(null)
      setLogoError('仅支持 PNG 或 JPG 图片。')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      event.target.value = ''
      setLogoPreview(null)
      setLogoFile(null)
      setLogoError('图片大小不能超过 10MB。')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setLogoPreview(typeof reader.result === 'string' ? reader.result : null)
    }
    reader.readAsDataURL(file)
    setLogoFile(file)
    setLogoError('')
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setLogoFile(null)
    setLogoError('')
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(event.currentTarget)
    const payload = new FormData()
    payload.append('name', String(formData.get('name') ?? ''))
    payload.append('slug', String(formData.get('slug') ?? '').toLowerCase())
    if (logoFile) {
      payload.append('logo', logoFile)
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/orgs`,
        {
          method: 'POST',
          credentials: 'include',
          body: payload,
        },
      )

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string }
          | null
        setStatus('error')
        setErrorMessage(data?.message ?? '创建失败，请稍后再试。')
        return
      }

      onCreated()
    } catch (error) {
      setStatus('error')
      setErrorMessage('网络异常，请检查后重试。')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-[460px] min-h-[560px] rounded-[2rem] border border-black/5 bg-white p-12 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
          aria-label="关闭"
        >
          <X size={16} />
        </button>
        <div className="flex min-h-[464px] flex-col justify-center">
          <h2 className="text-2xl font-semibold text-[#0b0d12]">创建组织</h2>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="logo" className="text-sm font-semibold text-[#1c2333]">
                组织 Logo
              </Label>
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#f7f7f8]">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="组织 Logo 预览"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={20} className="text-slate-400" />
                  )}
                </div>
                <div>
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  ref={logoInputRef}
                />
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="h-9 rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    上传
                  </Button>
                  {logoPreview ? (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm font-semibold text-slate-500 hover:text-slate-700"
                      onClick={handleRemoveLogo}
                    >
                      移除
                    </Button>
                  ) : null}
                </div>
                  <p className="mt-2 text-xs text-slate-400">
                    推荐比例 1:1，最大 10MB
                  </p>
                  {logoError ? (
                    <p className="mt-2 text-xs text-red-600">{logoError}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-[#1c2333]">
                组织名称
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="例如：Acme 团队"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-semibold text-[#1c2333]">
                唯一标识
              </Label>
              <Input
                id="slug"
                name="slug"
                placeholder="例如：acme-team"
                required
              />
              <p className="text-xs text-slate-400">
                仅支持小写字母、数字与中横线。
              </p>
            </div>

            {status === 'error' ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="h-12 w-full rounded-full bg-gradient-to-r from-[#ff6a3d] to-[#ff9a5f] text-base font-bold text-[#151515] shadow-[0_10px_30px_rgba(255,106,61,0.35)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              创建组织
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
