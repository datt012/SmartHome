import { EntityRepository, Repository } from 'typeorm';
import { Room } from '../domain/room.entity';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {}
