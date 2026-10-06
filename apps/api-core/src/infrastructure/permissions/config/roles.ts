export const rolesConfig = [
  { name: 'admin', label: 'admin' },
  { name: 'user', label: 'user' },
] as const;

export type RoleName = (typeof rolesConfig)[number]['label'];
