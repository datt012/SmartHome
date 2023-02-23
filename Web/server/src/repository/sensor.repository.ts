import { EntityRepository, Repository } from 'typeorm';
import { Sensor } from '../domain/sensor.entity';

@EntityRepository(Sensor)
export class SensorRepository extends Repository<Sensor> {}
