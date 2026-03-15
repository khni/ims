export const ROUTES = {
  app: {
    index: (workspaceId?: string) =>
      `/workspace${workspaceId ? `/${workspaceId}` : ""}`,
    create_org: "/workspace/create",
  },
  auth: {
    index: "/auth",
    forget_password: "/auth/forget-password",
  },

  home: "/",
};
