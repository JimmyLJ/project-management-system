import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

type CreateProjectDialogProps = {
  open: boolean
  workspaceName: string
  onClose: () => void
}

export function CreateProjectDialog({
  open,
  workspaceName,
  onClose,
}: CreateProjectDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10 dark:bg-black/60">
      <div className="relative w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-[#0f172a] overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="关闭"
        >
          <X size={18} />
        </button>

        <div className="max-h-[calc(100vh-80px)] overflow-y-auto p-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              创建新项目
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              所在工作区：<span className="font-semibold text-blue-600 dark:text-blue-400">{workspaceName}</span>
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={(event) => event.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                项目名称
              </Label>
              <Input id="projectName" name="projectName" placeholder="请输入项目名称" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                描述
              </Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="描述你的项目"
                className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm text-[#0b0d12] transition-colors placeholder:text-[#8b94a7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c7c8c] focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-950"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  状态
                </Label>
                <select
                  id="status"
                  name="status"
                  className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c7c8c] focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-950"
                  defaultValue="planning"
                >
                  <option value="planning">规划中</option>
                  <option value="active">进行中</option>
                  <option value="review">评审中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  优先级
                </Label>
                <select
                  id="priority"
                  name="priority"
                  className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c7c8c] focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-950"
                  defaultValue="medium"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  开始日期
                </Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  结束日期
                </Label>
                <Input id="endDate" name="endDate" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                项目负责人
              </Label>
              <select
                id="lead"
                name="lead"
                className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c7c8c] focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-950"
                defaultValue="none"
              >
                <option value="none">未指定</option>
                <option value="ji">Ji Li</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="members" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                团队成员
              </Label>
              <select
                id="members"
                name="members"
                className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c7c8c] focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:focus-visible:ring-slate-400 dark:focus-visible:ring-offset-slate-950"
                defaultValue="none"
              >
                <option value="none">添加团队成员</option>
                <option value="ji">Ji Li</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                取消
              </button>
              <Button type="submit" className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500">
                创建项目
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
