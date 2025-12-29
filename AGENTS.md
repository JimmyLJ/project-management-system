# AGENTS.md

## 项目概述
这是一个基于 monorepo 的全栈项目。

使用的技术栈：
- 前端：Vite + React
- 后端：Node.js + Hono
- 数据库：PostgreSQL
- ORM：Drizzle
- 包管理器：pnpm

## 全局规则
- 本项目统一使用 pnpm 作为唯一包管理器，禁止使用 npm 或 yarn
- 优先选择最小化的、增量式的变更，而不是追求完整性
- 除非接到指示，否则不要重构或重组现有代码

## 依赖约束（严格）
- 默认禁止任何依赖变更
- 不得修改 package.json 或 pnpm-lock.yaml
- 不得引入未声明的包
- 不得执行任何依赖安装命令
- 如需新依赖，必须停止并等待批准
