import { EntityRepository, Repository } from 'typeorm';
import { Device } from '../domain/device.entity';

@EntityRepository(Device)
export class DeviceRepository extends Repository<Device> {}
