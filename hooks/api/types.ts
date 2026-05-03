export type WorkspaceMember = {
  id: number;
  userId: number;
  workspaceId: number;
  role: "ADMIN" | "MEMBER" | "OWNER" | string;
  createdAt: string;
};

export type Organization = {
  id: number;
  name: string;
  isDefault: boolean;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
};

export type Workspace = {
  id: number;
  name: string;
  slug: string;
  isDefault: boolean;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  members: WorkspaceMember[];
  organization: Organization;
};

export type User = {
  id: number;
  email: string;
  name: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: number;
  userId: number;
  accountId: number;
  hashedRefreshToken: string;
  ip: string;
  userAgent: string;
  expiresAt: string;
  createdAt: string;
  user: User;
};
