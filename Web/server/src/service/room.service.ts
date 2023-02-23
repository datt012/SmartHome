import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RoomDTO } from '../service/dto/room.dto';
import { RoomMapper } from '../service/mapper/room.mapper';
import { RoomRepository } from '../repository/room.repository';
import { HomeRepository } from '../repository/home.repository';

const relationshipNames = ['home'];

@Injectable()
export class RoomService {
  logger = new Logger('RoomService');

  constructor(
    @InjectRepository(RoomRepository) private roomRepository: RoomRepository,
    @InjectRepository(HomeRepository) private homeRepository: HomeRepository) {
  }

  async findById(id: string): Promise<RoomDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.roomRepository.findOne(id, options);
    return RoomMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<RoomDTO>): Promise<RoomDTO | undefined> {
    const result = await this.roomRepository.findOne(options);
    return RoomMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<RoomDTO>, homeId: string): Promise<[RoomDTO[], number]> {
    options.relations = relationshipNames;
    const home = await this.homeRepository.findOne(homeId);
    if (home) {
      const roomIds = home.rooms.map(r => r.id);
      if (roomIds.length > 0) {
        const resultList = await this.roomRepository.findByIds(roomIds, options);
        const roomDtos: RoomDTO[] = [];
        if (resultList) {
          resultList.forEach((room) => roomDtos.push(RoomMapper.fromEntityToDTO(room)));
        }
        return [roomDtos, roomDtos.length];
      } else {
        return [[], 0];
      }
    } else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'HomePage does not exist'
      }, HttpStatus.NOT_FOUND);
    }

  }

  async save(roomDTO: RoomDTO, homeId: string, creator?: string): Promise<RoomDTO | undefined> {
    const entity = RoomMapper.fromDTOtoEntity(roomDTO);
    const home = await this.homeRepository.findOne(homeId);
    if (home) {
      if (creator) {
        if (!entity.createdBy) {
          entity.createdBy = creator;
        }
        entity.lastModifiedBy = creator;
      }
      const result = await this.roomRepository.save(entity);
      await this.homeRepository.update(homeId, { rooms: [...home.rooms, result] });
      return RoomMapper.fromEntityToDTO(result);
    } else {
      // catch error
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'HomePage does not exist'
      }, HttpStatus.NOT_FOUND);
    }
  }

  async update(roomDTO: RoomDTO, updater?: string): Promise<RoomDTO | undefined> {
    const entity = RoomMapper.fromDTOtoEntity(roomDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    await this.roomRepository.update(entity.id, entity);
    return roomDTO;
  }

  async deleteById(homeId: string, id: string): Promise<void | undefined> {
    const home = await this.homeRepository.findOne(homeId);
    if (home) {
      const newRooms = home.rooms.filter(room => room.id.toString() !== id);
      await this.homeRepository.update(homeId, { rooms: newRooms });
      await this.roomRepository.delete(id);
      const entityFind = await this.findById(id);
      if (entityFind) {
        throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
      }
      return;
    } else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'HomePage does not exist'
      }, HttpStatus.NOT_FOUND);
    }
  }
}
