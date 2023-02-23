import { EntityRepository, Repository } from 'typeorm';
import { Controller } from '../domain/controller.entity';

@EntityRepository(Controller)
export class ControllerRepository extends Repository<Controller> {}
