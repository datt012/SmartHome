import { EntityRepository, Repository } from 'typeorm';
import { Home } from '../domain/home.entity';

@EntityRepository(Home)
export class HomeRepository extends Repository<Home> {}
