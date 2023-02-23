import dayjs from 'dayjs';

export interface ILog {
  id?: string;
  description?: string | null;
  createdAt?: string | null;
  createdDate?: Date;
}

export const defaultValue: Readonly<ILog> = {};
