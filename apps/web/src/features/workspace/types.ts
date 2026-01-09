export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  ownerId: string;
  createdAt: string;
}

export interface CreateWorkspacePayload {
  name: string;
  slug: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
}
