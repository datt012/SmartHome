import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { ControllerDTO } from '../service/dto/controller.dto';
import { ControllerMapper } from '../service/mapper/controller.mapper';
import { ControllerRepository } from '../repository/controller.repository';
import { HomeRepository } from '../repository/home.repository';
import { RoomRepository } from '../repository/room.repository';

const relationshipNames = [];

@Injectable()
export class ControllerService {
  logger = new Logger('ControllerService');

  constructor(
    @InjectRepository(ControllerRepository) private controllerRepository: ControllerRepository,
    @InjectRepository(RoomRepository) private roomRepository: RoomRepository
  ) {
  }

  async findById(id: string): Promise<ControllerDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.controllerRepository.findOne(id, options);
    return ControllerMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<ControllerDTO>): Promise<ControllerDTO | undefined> {
    const result = await this.controllerRepository.findOne(options);
    return ControllerMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<ControllerDTO>, roomId: string): Promise<[ControllerDTO[], number]> {
    options.relations = relationshipNames;
    const room = await this.roomRepository.findOne(roomId);
    if (room) {
      const controllerIds = room.controllers.map(c => c.id);
      if (controllerIds.length > 0) {
        const resultList = await this.controllerRepository.findByIds(controllerIds, options);
        const controllerDTOs: ControllerDTO[] = [];
        if (resultList) {
          resultList.forEach((controller) => controllerDTOs.push(ControllerMapper.fromEntityToDTO(controller)));
        }
        return [controllerDTOs, controllerDTOs.length];
      } else {
        return [[], 0];
      }
    } else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Room does not exist'
      }, HttpStatus.NOT_FOUND);
    }
  }

  async save(controllerDTO: ControllerDTO, roomId: string, creator?: string): Promise<ControllerDTO | undefined> {
    const entity = ControllerMapper.fromDTOtoEntity(controllerDTO);
    const room = await this.roomRepository.findOne(roomId);
    if (room) {
      if (creator) {
        if (!entity.createdBy) {
          entity.createdBy = creator;
        }
        entity.lastModifiedBy = creator;
      }
      const result = await this.controllerRepository.save(entity);
      await this.roomRepository.update(room.id, {
        controllers: [
          ...room.controllers,
          result
        ]
      });
      return ControllerMapper.fromEntityToDTO(result);
    } else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'HomePage does not exist'
      }, HttpStatus.NOT_FOUND);
    }
  }

  async update(controllerDTO: ControllerDTO, updater?: string): Promise<ControllerDTO | undefined> {
    const entity = ControllerMapper.fromDTOtoEntity(controllerDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    await this.controllerRepository.update(entity.id, entity);
    return controllerDTO;
  }

  async deleteById(id: string, roomId: string): Promise<void | undefined> {
    const room = await this.roomRepository.findOne(roomId);
    if (room) {
      const newControllers = room.controllers.filter(c => c.id !== id);
      await this.roomRepository.update(room.id, { controllers: newControllers });
      await this.controllerRepository.delete(id);
      const entityFind = await this.findById(id);
      if (entityFind) {
        throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
      }
      return;
    } else {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Room does not exist'
      }, HttpStatus.NOT_FOUND);
    }
  }
}
