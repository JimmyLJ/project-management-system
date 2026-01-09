import { Hono } from "hono";
import { and, desc, eq, inArray, or } from "drizzle-orm";
import { db } from "../db";
import { projectMembers, projects, workspaceMembers, workspaces } from "../db/schema";
import { auth } from "../auth";

const projectsRouter = new Hono();

const statusValues = new Set(["planning", "active", "completed", "on_hold", "cancelled"]);
const priorityValues = new Set(["low", "medium", "high"]);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (value: string) => datePattern.test(value) && !Number.isNaN(new Date(value).getTime());

const getWorkspaceForUser = async (workspaceId: string, userId: string) => {
  const result = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .leftJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(
      and(
        eq(workspaces.id, workspaceId),
        or(eq(workspaces.ownerId, userId), eq(workspaceMembers.userId, userId)),
      ),
    )
    .limit(1);

  return result[0];
};

projectsRouter.get("/", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) {
    return c.json({ message: "未登录" }, 401);
  }

  const workspaceId = c.req.query("workspaceId");
  if (!workspaceId) {
    return c.json({ message: "workspaceId 是必填项" }, 400);
  }

  const workspace = await getWorkspaceForUser(workspaceId, session.user.id);
  if (!workspace) {
    return c.json({ message: "无权限访问该工作区" }, 403);
  }

  const result = await db
    .select({
      id: projects.id,
      workspaceId: projects.workspaceId,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      priority: projects.priority,
      startDate: projects.startDate,
      endDate: projects.endDate,
      createdBy: projects.createdBy,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .where(eq(projects.workspaceId, workspaceId))
    .orderBy(desc(projects.createdAt));

  if (result.length === 0) {
    return c.json({ projects: [] });
  }

  const memberRows = await db
    .select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(inArray(projectMembers.projectId, result.map((project) => project.id)));

  const memberCountMap = new Map<string, number>();
  for (const row of memberRows) {
    memberCountMap.set(row.projectId, (memberCountMap.get(row.projectId) ?? 0) + 1);
  }

  return c.json({
    projects: result.map((project) => ({
      ...project,
      memberCount: memberCountMap.get(project.id) ?? 0,
    })),
  });
});

projectsRouter.post("/", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) {
    return c.json({ message: "未登录" }, 401);
  }

  const body = await c.req.json<{
    workspaceId?: string;
    name?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    startDate?: string | null;
    endDate?: string | null;
    leadId?: string | null;
    memberIds?: string[];
  }>();

  if (!body.workspaceId) {
    return c.json({ message: "workspaceId 是必填项" }, 400);
  }

  const name = body.name?.trim() ?? "";
  if (name.length < 2 || name.length > 200) {
    return c.json({ message: "项目名称需要 2-200 个字符" }, 400);
  }

  const status = body.status ?? "planning";
  if (!statusValues.has(status)) {
    return c.json({ message: "项目状态不合法" }, 400);
  }

  const priority = body.priority ?? "medium";
  if (!priorityValues.has(priority)) {
    return c.json({ message: "项目优先级不合法" }, 400);
  }

  const startDate = body.startDate ?? null;
  const endDate = body.endDate ?? null;

  if (startDate && !isValidDate(startDate)) {
    return c.json({ message: "开始日期格式不正确" }, 400);
  }
  if (endDate && !isValidDate(endDate)) {
    return c.json({ message: "结束日期格式不正确" }, 400);
  }
  if (startDate && endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (end < start) {
      return c.json({ message: "结束日期不能早于开始日期" }, 400);
    }
  }

  const workspace = await getWorkspaceForUser(body.workspaceId, session.user.id);
  if (!workspace) {
    return c.json({ message: "无权限访问该工作区" }, 403);
  }

  const [project] = await db
    .insert(projects)
    .values({
      workspaceId: body.workspaceId,
      name,
      description: body.description ?? null,
      status,
      priority,
      startDate,
      endDate,
      createdBy: session.user.id,
    })
    .returning();

  const leadId = body.leadId ?? null;
  const memberIds = Array.isArray(body.memberIds) ? body.memberIds.filter(Boolean) : [];
  const members = new Set(memberIds.filter((id) => id !== leadId));

  if (leadId) {
    await db.insert(projectMembers).values({
      projectId: project.id,
      userId: leadId,
      role: "lead",
    });
  }

  if (members.size > 0) {
    await db.insert(projectMembers).values(
      Array.from(members).map((memberId) => ({
        projectId: project.id,
        userId: memberId,
        role: "member",
      })),
    );
  }

  const memberCount = (leadId ? 1 : 0) + members.size;

  return c.json({ project: { ...project, memberCount } }, 201);
});

export { projectsRouter };
