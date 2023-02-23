import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { HomeDTO } from '../service/dto/home.dto';
import { HomeMapper } from '../service/mapper/home.mapper';
import { HomeRepository } from '../repository/home.repository';
import { RoomRepository } from '../repository/room.repository';

const relationshipNames = [];

@Injectable()
export class HomeService {
  logger = new Logger('HomeService');

  constructor(
    @InjectRepository(HomeRepository) private homeRepository: HomeRepository,
    @InjectRepository(RoomRepository) private roomRepository: RoomRepository
  ) {
  }

  async findById(id: string): Promise<HomeDTO | undefined> {
    const options = { relations: relationshipNames };
    const result = await this.homeRepository.findOne(id, options);
    return HomeMapper.fromEntityToDTO(result);
  }

  async findByFields(options: FindOneOptions<HomeDTO>): Promise<HomeDTO | undefined> {
    const result = await this.homeRepository.findOne(options);
    return HomeMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<HomeDTO>): Promise<[HomeDTO[], number]> {
    const resultList = await this.homeRepository.findAndCount(options);
    const homeDTO: HomeDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach((home) => homeDTO.push(HomeMapper.fromEntityToDTO(home)));
      resultList[0] = homeDTO;
    }
    return resultList;
  }

  async save(homeDTO: HomeDTO, creator?: string): Promise<HomeDTO | undefined> {
    const entity = HomeMapper.fromDTOtoEntity(homeDTO);
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }
    const result = await this.homeRepository.save(entity);
    return HomeMapper.fromEntityToDTO(result);
  }

  async update(homeDTO: HomeDTO, updater?: string): Promise<HomeDTO | undefined> {
    const entity = HomeMapper.fromDTOtoEntity(homeDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    await this.homeRepository.update(entity.id, entity);
    return homeDTO;
  }

  async deleteById(id: string): Promise<void | undefined> {
    const home = await this.homeRepository.findOne(id);
    if (home) {
      const roomIds = home.rooms.map(r => r.id);
      await this.roomRepository.delete(roomIds);
      await this.homeRepository.delete(id);
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
