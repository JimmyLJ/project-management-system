export type ProjectStatus = "planning" | "active" | "completed" | "on_hold" | "cancelled";

export type ProjectPriority = "low" | "medium" | "high";

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string | null;
  endDate: string | null;
  memberCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  workspaceId: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string | null;
  endDate?: string | null;
  leadId?: string | null;
  memberIds?: string[];
}
