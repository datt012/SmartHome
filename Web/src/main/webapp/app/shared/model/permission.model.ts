export interface IPermission {
  id?: string;
  permission?: string | null;
}

export const defaultValue: Readonly<IPermission> = {};
