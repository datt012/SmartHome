import { EntityRepository, Repository } from 'typeorm';
import { Log } from '../domain/log.entity';

@EntityRepository(Log)
export class LogRepository extends Repository<Log> {}
