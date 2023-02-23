export interface IHome {
  id?: string;
  name?: string | null;
  location?: string | null;
}

export const defaultValue: Readonly<IHome> = {};
