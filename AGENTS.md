# 项目管理系统

## 技术栈
- 前端
  - UI：React 19
  - 语言：TypeScript
  - 样式：Tailwind CSS v4
  - UI 组件：shadcn/ui
  - 图标：Lucide Icons
  - 日期处理：date-fns
  - 路由：React Router v7, 框架模式
  - 状态管理：Zustand, TanStack Query
  - 表单：React Hook Form + Zod
  - 后端：Hono
  - 包管理：pnpm
  - 测试：Vitest

## 项目结构
采用 monorepo，apps/ 放应用，packages/ 放共享包

## 代码风格
- 使用函数式组件
- 优先使用 const
- 尽量不写注释，如果必须，尽量用中文注释

## 测试注意事项
- 前端测试需要使用管理员权限运行，否则可能出现 esbuild 子进程 spawn EPERM
