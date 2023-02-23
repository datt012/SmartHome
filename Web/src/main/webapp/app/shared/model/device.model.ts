import { Status } from 'app/shared/model/enumerations/status.model';
import { ILog } from 'app/shared/model/log.model';

export interface IDevice {
  id?: string;
  status?: Status | null;
  type?: string | null;
  pin?: number | null;
  logs?: ILog[];
}

export const defaultValue: Readonly<IDevice> = {};
