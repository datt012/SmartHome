import { ILog } from 'app/shared/model/log.model';

export interface ISensor {
  id?: string;
  type?: string | null;
  pin?: number | null;
  logs?: ILog[];
}

export const defaultValue: Readonly<ISensor> = {};
