import { Hono } from 'hono'
import { eq, or } from 'drizzle-orm'
import { db } from '../db'
import { workspaces, workspaceMembers } from '../db/schema'
import { auth } from '../auth'

const workspacesRouter = new Hono()

workspacesRouter.get('/me', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session?.user) {
    return c.json({ message: '未登录' }, 401)
  }

  const userId = session.user.id

  const result = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      slug: workspaces.slug,
      logoUrl: workspaces.logoUrl,
      ownerId: workspaces.ownerId,
      createdAt: workspaces.createdAt,
    })
    .from(workspaces)
    .leftJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(
      or(
        eq(workspaces.ownerId, userId),
        eq(workspaceMembers.userId, userId)
      )
    )

  const uniqueWorkspaces = Array.from(
    new Map(result.map((w) => [w.id, w])).values()
  )

  return c.json({ workspaces: uniqueWorkspaces })
})

workspacesRouter.post('/', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session?.user) {
    return c.json({ message: '未登录' }, 401)
  }

  const body = await c.req.json<{ name: string; slug: string }>()

  if (!body.name || body.name.length < 2 || body.name.length > 50) {
    return c.json({ message: '工作区名称需要 2-50 个字符' }, 400)
  }

  const slugPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/
  if (!body.slug || body.slug.length < 2 || body.slug.length > 30 || !slugPattern.test(body.slug)) {
    return c.json({ message: 'Slug 需要 2-30 个字符，只能包含小写字母、数字和连字符' }, 400)
  }

  const existing = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(eq(workspaces.slug, body.slug))
    .limit(1)

  if (existing.length > 0) {
    return c.json({ message: '该 Slug 已被使用' }, 400)
  }

  const [workspace] = await db
    .insert(workspaces)
    .values({
      name: body.name,
      slug: body.slug,
      ownerId: session.user.id,
    })
    .returning()

  await db.insert(workspaceMembers).values({
    workspaceId: workspace.id,
    userId: session.user.id,
    role: 'owner',
  })

  return c.json({ workspace }, 201)
})

export { workspacesRouter }
